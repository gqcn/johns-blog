---
slug: "/notes/golang-copy-100gb-file-in-1-second"
title: "震惊！Golang拷贝100+GB的文件不到1秒，啥情况？"
hide_title: true
keywords: ["Go", "Golang", "文件拷贝", "XFS", "reflink", "CoW", "写时复制", "copy_file_range", "文件系统", "Linux内核", "性能分析", "系统调用", "strace"]
description: "深入分析为什么Go程序能在1秒内拷贝100GB+文件的神奇现象，揭秘XFS文件系统reflink特性和Copy-on-Write机制的工作原理"
---


## 1. 背景介绍
最近咱们系统增加了一个`AI`模型加速的组件，用于缓存大模型文件内容到本地的`hostPath`，并在训练、推理服务启动前通过`initContainer`的方式将大模型的文件（层级目录，很多文件）拷贝到业务容器中（没有使用目录软连接）。

但在测试时发现不管模型多大，从`2.9GB`到`139GB`的大模型文件，这个`initContainer`的拷贝操作都能瞬间完成（不到`1`秒）。然而使用`python`脚本或者`cp`命令执行目录文件拷贝，时间开销都是几秒到几分钟不等。

该情况无论是在容器中，还是在宿主机上都能够复现，前提是在同一块磁盘上进行拷贝，跨磁盘无法复现。

## 2. 排查过程
为了方便排查，我们在宿主机上进行复现和排查。

### 2.1 确认环境信息

#### 2.1.1 内核版本
这里使用的`Linux`内核版本是`5.15`版本。

```bash
$ uname -a
Linux dev-app-2-150-master-1 5.15.0-1078-nvidia #79-Ubuntu SMP Fri Apr 25 14:51:39 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
```
#### 2.1.2 系统版本

使用的是`Ubuntu 22.04.3 LTS`。

```bash
$ cat /etc/os-release
PRETTY_NAME="Ubuntu 22.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

#### 2.1.3 磁盘信息

##### 2.1.3.1 通过fdisk查看磁盘信息

其中`Disk model: MR9560-16i`的`MR9560-16i`表示磁盘使用的是`RAID6`类型。我们后续是在系统盘的`/tmp`目录下测试，因此主要关心系统盘即可。

```bash
$ fdisk -l
# ...

Disk /dev/sda: 558.41 GiB, 599584145408 bytes, 1171062784 sectors
Disk model: MR9560-16i
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 262144 bytes / 262144 bytes
Disklabel type: gpt
Disk identifier: 98429DEA-8628-4C03-99CD-9843A103346C

Device       Start        End    Sectors   Size Type
/dev/sda1     2048     526335     524288   256M EFI System
/dev/sda2   526336    2623487    2097152     1G Linux filesystem
/dev/sda3  2623488 1171062750 1168439263 557.2G Linux filesystem


Disk /dev/sdb: 4.91 TiB, 5396257308672 bytes, 10539565056 sectors
Disk model: MR9560-16i
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 262144 bytes / 1048576 bytes
Disklabel type: gpt
Disk identifier: E1B34555-9B4B-4EF7-B18B-6A7F2B5D5E40

Device     Start         End     Sectors  Size Type
/dev/sdb1   2048 10539563007 10539560960  4.9T Linux filesystem

# ...
```

##### 2.1.3.2 通过df查看文件系统类型
其中系统盘使用了`xfs`的系统类型。

```bash
$ df -hT
Filesystem                      Type   Size  Used Avail Use% Mounted on
tmpfs                           tmpfs   26G  9.3M   26G   1% /run
/dev/mapper/ubuntu-root         xfs    550G  106G  444G  20% /
tmpfs                           tmpfs  126G  192K  126G   1% /dev/shm
tmpfs                           tmpfs  5.0M     0  5.0M   0% /run/lock
/dev/mapper/vg_home-lv_home     xfs    5.0T  2.5T  2.5T  51% /home
/dev/sda2                       xfs   1006M  621M  386M  62% /boot
/dev/sda1                       vfat   256M  6.1M  250M   3% /boot/efi
shm                             tmpfs   64M     0   64M   0% /run/containerd/io.containerd.grpc.v1.cri/sandboxes/c268a702b2a081b2ce66466d4dc48ab0fb718026e637f0e41456ee86a2e1bf38/shm
# ...
```

#### 2.1.4 Golang源代码
为了简化示例，这里使用到了一个第三方包 `github.com/otiai10/copy` ，这个包实现比较简单，这里换成自己手写的文件/目录拷贝也是能复现的。

```go
package main

import (
  "log/slog"
  "os"

  "github.com/otiai10/copy"
)

func main() {
  if len(os.Args) < 3 {
    slog.Error("usage: copy <src> <dst>")
    return
  }

  srcPath := os.Args[1]
  dstPath := os.Args[2]

  if srcPath == "" || dstPath == "" {
    slog.Error("COPY_SRC or COPY_DST is not set")
    return
  }

  if err := copy.Copy(srcPath, dstPath); err != nil {
    slog.Error("failed to copy models", "error", err)
    return
  }

  slog.Info("copy models", "source", srcPath, "target", dstPath)
}
```

将该源代码编译为Linux下可以运行的二进制，文件名为`copy`。使用方式为：

```bash
./copy 源文件 目标文件
```

#### 2.1.5 文件信息
测试的文件大小约`19GB`。

```bash
$ ll
total 39680432
-rwxr-xr-x 1 qiang.guo qiang.guo     3166731 Jul  7 15:44 copy
-rwxrwxrwx 1 qiang.guo qiang.guo 20314793478 Jul  7 15:54 tritonserver-24.02.09.10-llm-mo-py3.10.tar
-rwxrwxrwx 1 qiang.guo qiang.guo 20314793478 Jul  7 16:17 tritonserver-24.02.09.10-llm-mo-py3.10.tar2
```

其中：

- `copy`文件是上面源代码编译后的二进制文件。
- `tritonserver-24.02.09.10-llm-mo-py3.10.tar`是大模型源文件打包后的文件，只使用一个大文件而不是目录是为了方便测试。
- `tritonserver-24.02.09.10-llm-mo-py3.10.tar2`是大模型源文件通过copy程序拷贝后的文件，文件拷贝时间开销不到1秒（毫秒级别）。

### 2.2 源代码排查

#### 2.2.1 自身文件排查

首先检查了自己的源代码，并没有特殊的地方，底层都是调用的`Golang`标准库`io.Copy/io.CopyBuffer`来实现的文件拷贝。有没有可能在`io.Copy/io.CopyBuffer`的实现中其实没有真实实现大文件拷贝，而是做了软连接或硬链接？

实际上一开始我们就可以排除这样的想法，因为如果是软连接，在系统上就可以看出来；如果是硬链接的话`inode`也能看得出来；并且`Golang`标准库原则上不会自动做这种骚操作。
稳妥起见，还是看一下两个文件的`inode`信息：

```bash
$ ll -i
total 39680432
520141384 -rwxr-xr-x 1 qiang.guo qiang.guo     3166731 Jul  7 15:44 copy
520141385 -rwxrwxrwx 1 qiang.guo qiang.guo 20314793478 Jul  7 15:54 tritonserver-24.02.09.10-llm-mo-py3.10.tar
520141386 -rwxrwxrwx 1 qiang.guo qiang.guo 20314793478 Jul  7 16:17 tritonserver-24.02.09.10-llm-mo-py3.10.tar2
```

看起来两个文件的`inode`并没有一样，因此放弃拷贝后的文件是连接文件这一种可能。

#### 2.2.2 io.Copy深入排查

既然最终都会走到`io.Copy*`方法，那么我们应该去查看标准库的具体实现逻辑和流程。

这个拷贝操作最终都会走到一个系统调用，以`Linux`系统为例，具体在`/usr/local/go/src/os/zero_copy_linux.go`源码文件的这里：

```go
func (f *File) copyFileRange(r io.Reader) (written int64, handled bool, err error) {
    // ...
    written, handled, err = pollCopyFileRange(&f.pfd, &src.pfd, remain)
    return written, handled, wrapSyscallError("copy_file_range", err)
}
```

其中的`pollCopyFileRange`是一个系统调用，不同的系统实现会不一样。

```go
import (
    "internal/poll"
    "io"
    "syscall"
)

var (
    pollCopyFileRange = poll.CopyFileRange
    pollSplice        = poll.Splice
)
```

大概的调用关系是这样的：

```text
应用程序 (Go)
    ↓ io.Copy()
标准库 (glibc)
    ↓ read()/write() 或 copy_file_range()
内核 VFS层
    ↓
具体文件系统实现
```

初步看在程序这块本身没有什么问题，都是做的拷贝操作，并且最后调用的是系统函数实现的文件拷贝。如果需要进一步排查的话，需要去查看系统函数源码实现，可能会稍微麻烦一些，因此我们先去排查下其他方面，比如磁盘的一些信息。

### 2.3 磁盘信息排查
我们看看是否可能是外部环境引起的，特别是进一步看看磁盘的信息。之前在查看磁盘信息的时候，知道磁盘使用的是`RAID6`和`XFS`文件系统，有没可能跟这两个有关系？

#### 2.3.1 RAID6
`RAID6`是一种使用双重奇偶校验的磁盘阵列技术，能够同时容忍`2`块磁盘故障而不丢失数据。它至少需要`4`块磁盘，其中`2`块用于存储校验信息。`RAID6`的主要优势是极高的可靠性和良好的读性能，特别适合关键业务数据存储。缺点是写性能较差（需要计算双重校验）和较长的重建时间。

#### 2.3.2 XFS

`XFS`是一个高性能的`64`位日志式文件系统，专为处理大文件和高并发`I/O`而设计。它支持高达`8EB`的文件系统容量，采用`extent-based`的空间管理方式，能够有效减少文件碎片。`XFS`的突出特点包括卓越的大文件性能、在线扩容、`reflink`支持以及优秀的并发处理能力。目前是`RHEL/CentOS 7+`的默认文件系统。

这里有个`reflink`的特性让人眼前一亮，看看是干什么的。

#### 2.3.3 关于reflink特性

`reflink`是`XFS`文件系统的写时复制（`Copy-on-Write`, `CoW`）功能，允许多个文件共享相同的物理数据块，直到其中一个文件被修改时才进行实际的数据复制。

这个`CoW`功能具体又是什么呢？

1. 初始化状态-创建`CoW`副本

    磁盘布局：

    ```text
    ┌───────────────┐
    │   数据块 A     │ ← 原文件和副本都指向这里
    │   数据块 B     │
    │   数据块 C     │
    └───────────────┘
        ↑       ↑
    原文件元数据  副本文件元数据
    ```

2. 读取操作 - 共享数据
3. 写入操作 - 触发复制

    写入后的磁盘布局：

    ```text
    ┌───────┬───────┐
    │   数据块 A     │ ← 原文件仍指向这里
    │   数据块 B     │
    │   数据块 C     │
    │   数据块 A'    │ ← 副本的新数据块
    │   数据块 B'    │
    │   数据块 C'    │
    └───────────────┘
        ↑          ↑
    原文件元数据 副本文件元数据
    ```

从结果现状来看的话，比较吻合`CoW`特性的特征，我们进一步确认一下。

#### 2.3.4 排查io.Copy*是否使用了CoW功能
查看两个大文件的**磁盘数据块范围**是否一致：

```bash
$ xfs_bmap -v tritonserver-24.02.09.10-llm-mo-py3.10.tar
tritonserver-24.02.09.10-llm-mo-py3.10.tar:
 EXT: FILE-OFFSET           BLOCK-RANGE          AG AG-OFFSET              TOTAL FLAGS
   0: [0..23]:              306733544..306733567 26 (25064..25087)            24 101010
   1: [24..3004535]:        327221808..330226319 27 (8716848..11721359)  3004512 101111
   2: [3004536..6100519]:   338943752..342039735 28 (8642312..11738295)  3095984 101111
   3: [6100520..16776703]:  342412320..353088503 29 (314400..10990583)  10676184 101111
   4: [16776704..25165311]: 365984352..374372959 31 (293472..8682079)    8388608 101111
   5: [25165312..36837367]: 601694208..613366263 51 (73728..11745783)   11672056 100101
   6: [36837368..39677327]: 613601792..616441751 52 (184832..3024791)    2839960 100101
   7: [39677328..39677335]: 365864304..365864311 31 (173424..173431)           8 101111
   
$ xfs_bmap -v tritonserver-24.02.09.10-llm-mo-py3.10.tar2
tritonserver-24.02.09.10-llm-mo-py3.10.tar2:
 EXT: FILE-OFFSET           BLOCK-RANGE          AG AG-OFFSET              TOTAL FLAGS
   0: [0..23]:              306733544..306733567 26 (25064..25087)            24 101010
   1: [24..3004535]:        327221808..330226319 27 (8716848..11721359)  3004512 101111
   2: [3004536..6100519]:   338943752..342039735 28 (8642312..11738295)  3095984 101111
   3: [6100520..16776703]:  342412320..353088503 29 (314400..10990583)  10676184 101111
   4: [16776704..25165311]: 365984352..374372959 31 (293472..8682079)    8388608 101111
   5: [25165312..36837367]: 601694208..613366263 51 (73728..11745783)   11672056 100101
   6: [36837368..39677327]: 613601792..616441751 52 (184832..3024791)    2839960 100101
   7: [39677328..39677335]: 365864304..365864311 31 (173424..173431)           8 101111
```

从`BLOCK-RANGE`看起来，这两个文件确实引用了同一个数据块！

我们再确认一下`XFS`开启的特性查看是否开启了`reflink`特性，如下，其中的`reflink=1`表示该特性是开启的。

```bash
$ xfs_info /
meta-data=/dev/mapper/ubuntu-root isize=512    agcount=98, agsize=1474560 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=0
         =                       reflink=1    bigtime=0 inobtcount=0
data     =                       bsize=4096   blocks=143958016, imaxpct=25
         =                       sunit=64     swidth=64 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=11520, version=2
         =                       sectsz=512   sunit=64 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
```

### 2.4 猜测与验证

目前有了比较确定的结论：这里的文件拷贝使用到了`CoW`特性。

但是为什么`Golang`程序的`io.Copy*`会引发`CoW`的特性呢？

猜测：与`Golang`程序没有任何关系，应该是底层`XFS`文件系统自动提供的`CoW`实现。

#### 2.4.1 更进一步的证据

为了验证我们的猜想，我们需要更进一步梳理程序的接口调用关系。通过源码分析，大概的调用关系应该是这样的：

```text
应用程序 (Go)
    ↓ io.Copy()
标准库 (glibc)
    ↓ read()/write() 或 copy_file_range()
内核 VFS层
    ↓
XFS文件系统
    ↓ 检测到相同文件系统内拷贝(猜测)
自动extent共享/COW优化(猜测)
```

其中内核的`VFS`层只是一层接口，最终的文件拷贝操作是由具体的文件系统提供的实现，比如在我们当前场景中是由`XFS`文件系统提供的实现。

再手动执行一次大文件拷贝，同时我们使用`strace`命令跟踪程序的系统调用，确定准确的系统函数调用关系和调用函数：

```bash
$ strace -e trace=all ./copy tritonserver-24.02.09.10-llm-mo-py3.10.tar tritonserver-24.02.09.10-llm-mo-py3.10.tar3
execve("./copy", ["./copy", "tritonserver-24.02.09.10-llm-mo-"..., "tritonserver-24.02.09.10-llm-mo-"...], 0x7ffecd624290 /* 37 vars */) = 0
arch_prctl(ARCH_SET_FS, 0x5f1db0)       = 0
sched_getaffinity(0, 8192, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127]) = 16
openat(AT_FDCWD, "/sys/kernel/mm/transparent_hugepage/hpage_pmd_size", O_RDONLY) = 3
read(3, "2097152\n", 20)                = 8
close(3)                                = 0
mmap(NULL, 262144, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2be3cb0000
mmap(NULL, 131072, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2be3c90000
mmap(NULL, 1048576, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2be3b90000
mmap(NULL, 8388608, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2be3390000
mmap(NULL, 67108864, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2bdf390000
mmap(NULL, 536870912, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2bbf390000
mmap(NULL, 536870912, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9f390000
mmap(0xc000000000, 67108864, PROT_NONE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0xc000000000
mmap(NULL, 33554432, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d390000
madvise(0x7f2b9d390000, 33554432, MADV_NOHUGEPAGE) = 0
mmap(NULL, 68624, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d37f000
mmap(0xc000000000, 4194304, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0xc000000000
mmap(0x7f2be3c90000, 131072, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2be3c90000
mmap(0x7f2be3c10000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2be3c10000
mmap(0x7f2be3796000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2be3796000
mmap(0x7f2be13c0000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2be13c0000
mmap(0x7f2bcf510000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2bcf510000
mmap(0x7f2baf510000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f2baf510000
mmap(NULL, 1048576, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d27f000
madvise(0x7f2b9d27f000, 1048576, MADV_NOHUGEPAGE) = 0
mmap(NULL, 65536, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d26f000
mmap(NULL, 65536, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d25f000
rt_sigprocmask(SIG_SETMASK, NULL, [], 8) = 0
fcntl(0, F_GETFD)                       = 0
fcntl(1, F_GETFD)                       = 0
fcntl(2, F_GETFD)                       = 0
mmap(NULL, 262144, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d21f000
sigaltstack(NULL, {ss_sp=NULL, ss_flags=SS_DISABLE, ss_size=0}) = 0
sigaltstack({ss_sp=0xc000008000, ss_flags=0, ss_size=32768}, NULL) = 0
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
gettid()                                = 45944
rt_sigaction(SIGHUP, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGHUP, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGINT, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGINT, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGQUIT, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGQUIT, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGILL, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGILL, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGTRAP, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGTRAP, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGABRT, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGABRT, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGBUS, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGBUS, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGFPE, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGFPE, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGUSR1, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGUSR1, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGSEGV, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGSEGV, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGUSR2, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGUSR2, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGPIPE, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGPIPE, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGALRM, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGALRM, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGTERM, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGTERM, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGSTKFLT, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGSTKFLT, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGCHLD, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGCHLD, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGURG, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGURG, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGXCPU, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGXCPU, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGXFSZ, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGXFSZ, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGVTALRM, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGVTALRM, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGPROF, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGPROF, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGWINCH, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGWINCH, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGIO, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGIO, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGPWR, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGPWR, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGSYS, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGSYS, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRTMIN, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_1, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_1, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_2, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_3, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_3, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_4, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_4, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_5, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_5, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_6, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_6, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_7, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_7, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_8, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_8, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_9, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_9, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_10, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_10, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_11, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_11, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_12, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_12, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_13, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_13, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_14, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_14, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_15, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_15, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_16, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_16, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_17, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_17, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_18, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_18, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_19, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_19, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_20, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_20, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_21, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_21, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_22, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_22, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_23, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_23, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_24, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_24, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_25, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_25, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_26, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_26, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_27, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_27, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_28, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_28, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_29, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_29, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_30, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_30, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_31, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_31, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigaction(SIGRT_32, NULL, {sa_handler=SIG_DFL, sa_mask=[], sa_flags=0}, 8) = 0
rt_sigaction(SIGRT_32, {sa_handler=0x4702a0, sa_mask=~[], sa_flags=SA_RESTORER|SA_ONSTACK|SA_RESTART|SA_SIGINFO, sa_restorer=0x4703e0}, NULL, 8) = 0
rt_sigprocmask(SIG_SETMASK, ~[], [], 8) = 0
clone(child_stack=0xc00002c000, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS, tls=0xc000176098) = 45951
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
rt_sigprocmask(SIG_SETMASK, ~[], [], 8) = 0
clone(child_stack=0xc000198000, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS, tls=0xc000176798) = 45952
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
--- SIGURG {si_signo=SIGURG, si_code=SI_TKILL, si_pid=45944, si_uid=40492906} ---
rt_sigreturn({mask=[]})                 = 0
sched_yield()                           = 0
futex(0x5f9d00, FUTEX_WAKE_PRIVATE, 1)  = 0
futex(0x5f2418, FUTEX_WAKE_PRIVATE, 1)  = 1
rt_sigprocmask(SIG_SETMASK, ~[], [], 8) = 0
clone(child_stack=0xc000194000, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS, tls=0xc000176e98) = 45954
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
futex(0xc000176f48, FUTEX_WAKE_PRIVATE, 1) = 1
futex(0xc000198148, FUTEX_WAKE_PRIVATE, 1) = 1
futex(0xc000198148, FUTEX_WAKE_PRIVATE, 1) = 1
getrlimit(RLIMIT_NOFILE, {rlim_cur=100*1024, rlim_max=200*1024}) = 0
setrlimit(RLIMIT_NOFILE, {rlim_cur=200*1024, rlim_max=200*1024}) = 0
fcntl(0, F_GETFL)                       = 0x402 (flags O_RDWR|O_APPEND)
futex(0xc000176f48, FUTEX_WAKE_PRIVATE, 1) = 1
mmap(NULL, 262144, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f2b9d1df000
fcntl(1, F_GETFL)                       = 0x402 (flags O_RDWR|O_APPEND)
fcntl(2, F_GETFL)                       = 0x402 (flags O_RDWR|O_APPEND)
newfstatat(AT_FDCWD, "tritonserver-24.02.09.10-llm-mo-py3.10.tar", {st_mode=S_IFREG|0777, st_size=20314793478, ...}, AT_SYMLINK_NOFOLLOW) = 0
openat(AT_FDCWD, "tritonserver-24.02.09.10-llm-mo-py3.10.tar", O_RDONLY|O_CLOEXEC) = 3
fcntl(3, F_GETFL)                       = 0x8000 (flags O_RDONLY|O_LARGEFILE)
fcntl(3, F_SETFL, O_RDONLY|O_NONBLOCK|O_LARGEFILE) = 0
epoll_create1(EPOLL_CLOEXEC)            = 4
eventfd2(0, EFD_CLOEXEC|EFD_NONBLOCK)   = 5
epoll_ctl(4, EPOLL_CTL_ADD, 5, {events=EPOLLIN, data={u32=6359368, u64=6359368}}) = 0
epoll_ctl(4, EPOLL_CTL_ADD, 3, {events=EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET, data={u32=1043333121, u64=9163590620033318913}}) = -1 EPERM (Operation not permitted)
fcntl(3, F_GETFL)                       = 0x8800 (flags O_RDONLY|O_NONBLOCK|O_LARGEFILE)
fcntl(3, F_SETFL, O_RDONLY|O_LARGEFILE) = 0
newfstatat(AT_FDCWD, ".", {st_mode=S_IFDIR|0755, st_size=119, ...}, 0) = 0
openat(AT_FDCWD, "tritonserver-24.02.09.10-llm-mo-py3.10.tar3", O_RDWR|O_CREAT|O_TRUNC|O_CLOEXEC, 0666) = 6
fcntl(6, F_GETFL)                       = 0x8002 (flags O_RDWR|O_LARGEFILE)
fcntl(6, F_SETFL, O_RDWR|O_NONBLOCK|O_LARGEFILE) = 0
epoll_ctl(4, EPOLL_CTL_ADD, 6, {events=EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET, data={u32=1043333122, u64=9163590620033318914}}) = -1 EPERM (Operation not permitted)
fcntl(6, F_GETFL)                       = 0x8802 (flags O_RDWR|O_NONBLOCK|O_LARGEFILE)
fcntl(6, F_SETFL, O_RDWR|O_LARGEFILE)   = 0
fchmodat(AT_FDCWD, "tritonserver-24.02.09.10-llm-mo-py3.10.tar3", 0777) = 0
uname({sysname="Linux", nodename="dev-app-2-150-master-1", ...}) = 0
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 1073741824
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 987440646
copy_file_range(3, NULL, 6, NULL, 1073741824, 0) = 0
close(6)                                = 0
close(3)                                = 0
openat(AT_FDCWD, "/etc/localtime", O_RDONLY) = 3
read(3, "TZif2\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 4096) = 561
read(3, "", 4096)                       = 0
close(3)                                = 0
write(2, "2025/07/07 16:40:18 INFO copy mo"..., 1382025/07/07 16:40:18 INFO copy models source=tritonserver-24.02.09.10-llm-mo-py3.10.tar target=tritonserver-24.02.09.10-llm-mo-py3.10.tar3
) = 138
exit_group(0)                           = ?
+++ exited with 0 +++
```

确定最终是通过`copy_file_range`系统函数来实现的文件拷贝，每次拷贝`1GB`左右的容量，而且速度非常快。

#### 2.4.2 copy_file_range系统函数

我们查查`Linux`手册看看`copy_file_range`这个系统函数的介绍：

```bash
$ man copy_file_range 
```

该函数是在`Linux`内核`4.5`版本引入的，但在`5.3`版本做了重构和改进：

```text
VERSIONS
    The copy_file_range() system call first appeared in Linux 4.5, but glibc 2.27 provides a user-space emulation when it is not available.

    A major rework of the kernel implementation occurred in 5.3.  Areas of the API that weren't clearly defined were clarified and  the  API  bounds  are  much  more  strictly
    checked than on earlier kernels.  Applications should target the behaviour and requirements of 5.3 kernels.

    First support for cross-filesystem copies was introduced in Linux 5.3.  Older kernels will return -EXDEV when cross-filesystem copies are attempted.
```

在该系统函数的最后有一段介绍比较关键：

```text
NOTES
    ...

    copy_file_range() gives filesystems an opportunity to implement "copy acceleration" techniques, such as the use of reflinks (i.e., two or more inodes that  share  pointers
    to the same copy-on-write disk blocks) or server-side-copy (in the case of NFS).
```

也就是说，如果底层的文件系统支持"拷贝加速"的技术，比如这里`XFS`提供的`reflink`，那么该系统函数将会"给文件系统机会"来实现"拷贝加速"。猜测字面意思，就是主要看`XFS`是怎么实现的，如果`XFS`支持通过`reflink`实现`CoW`特性，那么就会通过`reflink`来实现"拷贝加速"。

#### 2.4.3 还需要进行下去吗？

从目前的排查来看，基本上可以确定是因为`XFS`文件系统的`reflink`特性引发的`CoW`功能实现，使得大文件拷贝如此之快。如果需要更准确的证据，那么需要进一步去查看系统函数`copy_file_range`的源码实现，以及`XFS`对应的`copy_file_range`相关调用的接口实现。这样的排查成本会更大和周期也会更长，没有太大意义了。

随后我做了其他的一些尝试：

- 我找了一个其他文件系统（`etx4`）来同样做了测试，发现没有出现`CoW`。
- 找了一个`XFS`文件系统的磁盘，但是`Linux`内核是`4.18`，同样的拷贝操作，发现没有出现`CoW`。并且系统调用没有出现`copy_file_range`系统函数调用，而是调用的`read/write`系统函数。

## 3. 排查结论

- 大文件拷贝速度过快是由于底层的`XFS`文件系统开启了`reflink`特性引发的`CoW`功能实现，与`Golang`程序没有关系。
- `XFS`文件系统的`CoW`实现需要依赖`Linux`内核版本`>=4.5`后提供的`copy_file_range`系统函数。