---
slug: "/argo-workflow-introduction"
title: "Argo Workflow介绍"
hide_title: true
keywords:
  [
    "Argo Workflow",
    "工作流",
    "容器编排",
    "Kubernetes",
    "流程自动化",
    "任务编排",
  ]
description: "介绍 Argo Workflow 的基本概念、核心特性和使用场景，帮助读者理解这个基于 Kubernetes 的工作流引擎"
---


## 一、什么是流水线

在计算机中，**流水线是把一个重复的过程分解为若干个子过程，使每个子过程与其他子过程并行进行的技术，也叫 Pipeline**。由于这种工作方式与工厂中的生产流水线十分相似， 因此也被称为流水线技术。从本质上讲，流水线技术是一种时间并行技术。以“构建镜像”过程为例：

![](/attachments/3710404115-5fffb6e1af9bc.png)

在每一次构建镜像中，我们都需要拉下代码仓库中的代码，进行代码编译，构建镜像，最后推往镜像仓库。在每一次代码更改过后，这一过程都是不变的。使用流水线工具可以极大的提升这一过程的效率，只需要进行简单的配置便可以轻松的完成重复性的工作。这样的过程也被称之为 CI。

上图流程中使用的是 Jenkins。Jenkins 作为老牌流水线框架被大家所熟知。在云原生时代，Jenkins 推出了 Jenkins X 作为基于 Kubernetes 的新一代流水线，另外云原生时代还诞生了两大流水线框架—— Argo 和 Tekton。本文就详细介绍了 Argo 的相关内容。

## 二、Argo是什么

`Argo Workflows` 是一个开源的容器原生的工作流引擎，可在 Kubernetes 上编排并行作业。Argo Workflows 通过 Kubernetes CRD方式实现。Argo 基于 Kubernetes，可以直接使用 `kubectl` 安装，安装的组件主要包括了一些 CRD 以及对应的 controller 和一个 server。

![](/attachments/974227319-5fffb6fd58599.png)

> 注意，上述安装只会执行同 namespace 内的 Workflow，cluster install 详见文档。文档地址：[https://argoproj.github.io/argo-workflows/](https://argoproj.github.io/argo-workflows/)

## 三、三级定义

要了解 Argo 定义的 CRD，先从其中的三级定义入手。概念上的从大到小分别为 WorkflowTemplate、Workflow、Template，这些资源的命名有些相似，要注意分辨。[https://argoproj.github.io/argo-workflows/workflow-concepts/](https://argoproj.github.io/argo-workflows/workflow-concepts/)

### 1、Template

从最简单的 template 说起，一个 template 有多种类型，分别为 `container`、`script`、`dag`、`steps`、`resource` 以及 `suspend`**。**对于 template，我们可以简单的将其理解为一个 Pod ——container/script/resource 类型的 template 都会去实际控制一个 Pod，而 dag/steps 类型的 template 则是由多个基础类型的 template （container/script/resource）组成的。

*   **container**：最常见的模板类型，与 Kubernetes container spec 保持一致。
*   **script**：该类型基于 Container，支持用户在 template 定义一段脚本，另有一个 Source 字段来表示脚本的运行环境。
*   **resource**：该类型支持我们在 template 中对 kubernetes 的资源进行操作，有一个 action 字段可以指定操作类型，如 create, apply, delete 等，并且支持设定相关的成功与失败条件用于判断该 template 的成功与失败。
*   **suspend**：Suspend template 将在一段时间内或在手动恢复执行之前暂停执行。可以从 CLI （使用 argo resume）、API 或 UI 恢复执行。
*   **steps**：Steps Template 允许用户以一系列步骤定义任务。在 Steps 中，\[--\] 代表顺序执行，\[-\] 代表并行执行。
*   **dag**：DAG template 允许用户将任务定义为带依赖的有向无环图。在 DAG 中，通过 dependencies设置在特定任务开始之前必须完成的其他任务。没有任何依赖项的任务将立即运行。有关 DAG 的详细逻辑可见源码 [https://github.com/argoproj/a...](https://github.com/argoproj/argo/blob/master/workflow/controller/dag.go#L204)。

### 2、Workflow

在一个 Workflow 中，其 spec 中有一个名为 templates 的字段，在其中至少需要一个 template 作为其组成的任务。

一个最简单的 hello world 例子如下：

![](/attachments/2478719909-5fffb73379d3c.png)

在这个例子中，该 Workflow 的 templates 字段中指定了一个类型为 container 的 template，使用了 whalesay 镜像。

下面是一个稍微复杂的 workflow：

![](/attachments/2043671593-5fffb84536c0d.png)

### 3、WorkflowTemplate

WorkflowTemplate 相当于 Workflow 的模板库，和 Workflow 一样，也由 template 组成。用户在创建完 WorkflowTemplate 后，可以通过直接提交它们来执行 Workflow。

![](/attachments/2381840871-5fffb856062a4.png)

### 4、Workflow Overview

![](/attachments/3008190936-5fffb8654df09.png)

在了解了 Argo 的三级定义后，我们首先来深入一下 Argo 中最为关键的定义，Workflow。**Workflow 是 Argo 中最重要的资源，有两个重要的功能：**

*   **定义了要执行的工作流。**
*   **存储了工作流的状态。**

由于这些双重职责，Workflow 应该被视为一个 Active 的对象。它不仅是一个静态定义，也是上述定义的一个“实例”。

**Workflow Template 的定义与 Workflow 几乎一致，除了类型不同。**正因为 Workflow 既可以是一个定义也可以是一个实例，所以才需要 WorkflowTemplate 作为 Workflow 的模板，WorkflowTemplate 在定义后可以通过提交（Submit）来创建一个 Workflow。

而 **Workflow** 由一个 entrypoint 及一系列 template 组成，entrypoint 定义了这个 workflow 执行的入口，而 template 会实际去执行一个 Pod，其中，用户定义的内容会在 Pod 中以 Main Container 体现。此外，还有两个 **Sidecar** 来辅助运行。

## 四、Sidecar

在 Argo 中，这些 Sidecar 的镜像都是 **`argoexec`**。Argo 通过这个 executor 来完成一些流程控制。

### 1、Init

当用户的 template 中需要使用到 inputs 中的 `artifact` 或者是 script 类型时（script 类型需要注入脚本），Argo 都会为这个 pod 加上一个 **InitContainer** —— 其镜像为 argoexec，命令是 argoexec init。在这个 `Init Container` 中，主要工作就是加载 `artifact`：

![](/attachments/2657741167-5fffb8c009e45.png)

### 2、Wait

除了 Resource 类型外的 template，Argo 都会注入一个 Wait Container，用于等待 Main Container 的完成并结束所有 Sidecar。这个 Wait Container 的镜像同样为 `argoexec`，命令是 `argoexec wait`。（Resource 类型的不需要是因为 Resource 类型的 template 直接使用 `argoexec` 作为 Main Container 运行）

![](/attachments/143124495-5fffb8cd0ce29.png)

## 五、Inputs and Outputs

在运行 Workflow 时，一个常见的场景是输出产物的传递。通常，一个 Step 的输出产物可以用作后续步骤的输入产物。**在 Argo 中，产物可以通过 Artifact 或是 Parameter 传递。**

### 1、Artifact

**要使用 Argo 的 Artifact，首先必须配置和使用 Artifact 存储仓库。**具体的配置方式可以通过修改存有 Artifact Repository 信息的默认 Config Map 或者在 Workflow 中显示指定，详见 配置文档，在此不做赘述。下表为 Argo 支持的仓库类型。

![](/attachments/368505397-5fffb8e6dbf65.png)

一个简单的使用了 Artifact 的例子如下：

![](/attachments/3952974062-5fffb8f00b5dc.png)

**默认情况下，Artifact 被打包为 tgz(tar +gzip)包，我们也可以使用 archive 字段指定存档策略。**

在上面的例子里，名为 whalesay 的 template 使用 cowsay 命令生成一个名为 /tmp/hello-world.txt 的文件，然后将该文件作为一个名为 hello-art 的 Artifact 输出。名为 print-message 的 template 接受一个名为 message 的输入 Artifact，在 /tmp/message 的路径上解包它，然后使用 cat 命令打印 /tmp/message 的内容。

在前面 Sidecar 介绍中提到过，**Init Container 主要用于拉取 Artifact 产物**。这些 Sidecar 正是产物传递的关键。下面，我们通过介绍另一种产物传递的方式来体验 Argo 中传递产物的关键。

### 2、Script

先来看一个简单的例子：

![](/attachments/2992108274-5fffb90ac6e9e.png)

在上面的例子中，有两个类型为 script 的 template，script 允许使用 source 规范脚本主体。这将创建一个包含脚本主体的临时文件，然后将临时文件的名称作为最后一个参数传递给 command（执行脚本主体的解释器），这样便可以方便的执行不同类型的脚本（bash、python、js etc）。

Script template 会将脚本的标准输出分配给一个名为 result 的特殊输出参数从而被其他 template 调用。在这里，通过 `{{steps.generate.outputs.result}}` 即可获取到名为 generate 的 template 的脚本输出。

> `{{xxx}}` 是 Argo 固定的变量替换格式：
>
> *   关于变量的格式详见文档，文档地址：[https://github.com/argoproj/a...](https://github.com/argoproj/argo/blob/master/docs/variables.md)
> *   关于变量替换的逻辑详见源码，源码地址：[https://github.com/argoproj/a...](https://github.com/argoproj/argo/blob/master/workflow/common/util.go#L305)

那么，容器内部应该如何获取这个脚本输出呢？我们回到 Sidecar，在 Wait Container 中，有这样一段逻辑：

![](/attachments/455755801-5fffb91c238b1.png)


![](/attachments/4120955339-5fffb922eee06.png)

再来看看这个 Wait Container 的 Volume Mount 情况：

![](/attachments/3976899563-5fffb9477dcc3.png)

现在就十分明确了，**Wait Container 通过挂载 docker.sock 以及 service account，获取到 Main Container 中的输出结果，并保存到 Workflow 中**。当然，因为 Workflow 中保存了大量的信息，当一个 Workflow 的 Step 过多时，整个 Workflow 的结构会过于庞大。

### 3、Parameter

**Parameter 提供了一种通用机制，可以将步骤的结果用作参数。**Parameter 的工作原理与脚本结果类似，除了输出参数的值会被设置为生成文件的内容，而不是 stdout 的内容。如：  
![](/attachments/946689225-5fffba4a1a03d.png)

### 4、Volume

这并不是 Argo 处理产物传递的一种标准方式，但是通过共享存储，我们显然也能达到共通产物的结果。当然，如果使用 Volume，我们则无需借助 Inputs 和 Outputs。在 Workflow 的 Spec 中，我们定义一个 Volume 模板：

![](/attachments/2256174945-5fffba5dc767f.png)

并在其他的 template 中 mount 该 volume：

![](/attachments/3085720282-5fffba6cb8ae6.png)

## 六、流程控制功能

### 1、循环

在编写 Workflow 时，能够循环迭代一组输入通常是非常有用的，如下例所示:

![](/attachments/1714551681-5fffba7f41974.png)

在源码实现中，将会去判断 withItems，如果存在，则对其中的每个元素进行一次 step 的扩展。

![](/attachments/2164989231-5fffba8844abe.png)

### 2、条件判断

通过 `when` 关键字指定：

![](/attachments/1732212544-5fffbaa9f3a4f.png)

### 3、错误重试

![](/attachments/1488316399-5fffbab193435.png)

### 4、递归

**Template 可以递归地相互调用**，这是一个非常实用的功能。例如在机器学习场景中：可以设定准确率必须满足一个值，否则就持续进行训练。在下面这个抛硬币例子中，我们可以持续抛硬币，直到出现正面才结束整个工作流。

![](/attachments/3566924783-5fffbabdcee62.png)

以下是两次执行的结果，第一次执行直接抛到正面，结束流程；第二次重复三次后才抛到正面，结束流程。

![](/attachments/124113011-5fffbacb91e93.png)

### 5、退出处理

**退出处理是一个指定在 workflow 结束时执行的 template，无论成功或失败。**

![](/attachments/1707708146-5fffbb107bb50.png)

## 七、参考资料

*   [https://segmentfault.com/a/1190000038979821](https://segmentfault.com/a/1190000038979821)
*   [https://github.com/argoproj/argo-workflows](https://github.com/argoproj/argo-workflows)

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

