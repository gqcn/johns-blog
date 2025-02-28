---
slug: "/cloud-native/argo-workflow-source-code"
title: "Argo Workflow源码解析"
hide_title: true
keywords:
  [
    "Argo Workflow",
    "源码分析",
    "工作流引擎",
    "Kubernetes",
    "Go语言",
    "代码实现",
  ]
description: "深入分析 Argo Workflow 的源代码实现，探讨其核心组件、工作流程和关键功能的技术细节"
---




本文主要对Argo Workflow的核心Feature以及核心执行流程的源码实现进行解析讲解，Feature的实现细节请翻看Argo Workflow源码进行更深入的了解。

## 一、知识梳理

由于Argo本身的概念和内容较多，我这里先通过思维导图的方式梳理出其中较为关键的知识点，作为前置预备知识：

[https://whimsical.com/kubernetes-argo-framework-UZXKpyqfjqMzRx6mxuEdNt@2Ux7TurymN5ZuzLYocBL](https://whimsical.com/kubernetes-argo-framework-UZXKpyqfjqMzRx6mxuEdNt@2Ux7TurymN5ZuzLYocBL)

一些基本的概念和功能介绍这里不再赘述，可以参考之前的一篇Argo介绍文章：[Argo Workflow介绍](./1-Argo%20Workflow介绍.md)

![](/attachments/KubernetesArgoFramework.png)

## 二、充满好奇

为了更好地学习Argo Workflow，这里有几个问题，我们带着问题去探究Argo效果可能会更好一些：

1.  Workflow有哪些核心组件，各自的作用是什么？
2.  Workflow的流程数据是如何实现上下文传递的？
3.  Workflow的流程管理逻辑是如何实现的？
4.  Workflow的模板以及状态数据存储在哪里？

接下来我们先梳理一下Argo Workflow的核心流程以及一些关键逻辑，然后我们再回过头来解答这些问题。

## 三、工程结构

`Argo Workflow`的整个工程是使用经典的`kubebuilder`搭建的，因此大部分目录结构和`kubebuilder`保持一致。关于`kubebuilder`的介绍可参考：[https://cloudnative.to/kubebuilder/](https://cloudnative.to/kubebuilder/)

![](/attachments/image2021-7-3_15-15-13.png)

| 目录名称 | 职责及说明 |
| --- | --- |
| `api` | Swagger API 定义Json文件存放目录，主要是供Argo Server UI使用。 |
| `cmd` | 入口源码文件 |
|  ` - argo` | `argo CLI` |
|  ` - argoexec` | `argoexec container image`命令 |
|  ` - workflow-controller` | `Kubernetes CRD Controller` |
| `community` | 开源社区相关介绍，目前就一个README.MD |
| `config` | `Argo Workflow Controller`配置对象以及相关方法 |
| `docs` | `Argo Workflow`的相关介绍文档，与官网文档一致 |
| `errors` | 封装第三方 `[github.com/pkg/errors](http://github.com/pkg/errors)` 组件，`argo Workflow`内部使用的错误管理组件 |
| `examples` | 丰富的使用示例，主要是yaml文件 |
| `hack` | 项目使用到的脚本及工具文件 |
| `manifests` | `Argo`的安装配置文件，都是些`yaml`文件，使用`kustomize`工具管理，关于kustomize工具的介绍请参考：[https://kubernetes.io/zh/docs/tasks/manage-kubernetes-objects/kustomization/](https://kubernetes.io/zh/docs/tasks/manage-kubernetes-objects/kustomization/) |
| `persist` | Argo数据库持久化封装组件，支持MySQL/PostgreSQL两种数据库。持久化主要是针对于`Archived Workflow`对象的存储，包含Workflow的定义以及状态数据。 |
| `pkg` | `Argo Workflow`的对外API定义、结构定义、客户端定义，主要提供给外部服务、客户端使用。 |
|  ` - apiclient` | `Argo Server`对外`API`相关定义、客户端组件。 |
|  ` - workflow` | `Argo Workflow Controller`相关结构体定义。 |
|  ` - client` | `Argo Workflow Controller`与`Kubernetes`交互的`Client/Informer/Lister`定义。 |
| `server` | `Argo Server`模块。 |
| `test` | 单元测试文件。 |
| `ui` | `Argo Server`的前端`UI NodeJS`源码文件，使用`Yarn`包管理。 |
| `util` | 项目封装的工具包模块 |
| `workflow` | `Argo Workflow`的核心功能逻辑封装 |

## 四、Workflow Controller

`Argo`中最核心也最复杂的便是`Workflow Controller`的实现。`Argo Workflow Controller`的主要职责是`CRD`的实现，以及`Pod`的创建创建。由于`Argo`采用的是`Kubernetes CRD`设计，因此整体架构以及流程控制采用的是`Kubernetes Informer`实现，相关背景知识可以参考之前的两篇文章：[Kubernetes Informer及client-go资料](../0-Kubernetes/2-Kubernetes%20Informer及client-go资料.md)、[Kubernetes CRD, Controller, Operator](../0-Kubernetes/4-Kubernetes%20CRD,%20Controller,%20Operator.md)。

### 1、基本架构

![](/attachments/architecture.jpeg)

### 2、重要设计

`Argo Workflow Controller`组件有一些，我个人觉得较为重要的设计给大家分享下。

#### 1）定义与状态分离

这个其实是`Kubernetes`的标准设计，即`CRD实现`对象应当包含`Spec`及`Status`属性对象，其中`Spec`对应`CR`的定义，而`Status`对应`CR`的业务状态信息。`Spec`由业务客户端创建和修改，一般创建后不会更新，在`Informer Controller`处理流程中只能读取。而`Status`是`Informer Controller`中根据业务场景的需要不断变化的字段。

#### 2）定义与数据分离

`Argo Workflow Template`应当只包含流程以及变量定义，而变量数据则是由运行时产生的，例如通过Template运行时生成到终端或者`Artifact`，再通过`Outputs`的定义被其他的Template引用。一个`Node`执行成功之后，它的输出数据将会被保存到`Template.Status`字段（`Kubernetes etcd`）或者Artifact中，返回执行不会重复生成。一个`Node`执行失败后，如果重新执行将会重新去拉取依赖的数据。这种定义与数据分离的设计使得`Workflow Template`可以预先设计，甚至可以通过UI拖拽的方式生成。

#### 3）全局与局部变量

`在Argo Workflow Controller`内部中的变量分为两种:一种是`Workflow`全局生效的变量(`globalParams`)，一种是当前`Template`生效的本地变量(`localParams`)。其中全局变量也包括开发者自定义的输入/输出变量、`Workflow Annotations&Labels`，这些变量也是能被`Workflow`全局中访问。两种变量由于访问方式不同，因此不会相互冲突。

#### 4）模板化变量设计

`Argo Workflow Controller`的变量其实主要是使用到模板解析中。在`Controller`处理流程中，会看到多次的`json.Marshal/json.Unmarshal`操作：通过`json.Marhsal`将`Template`对象转为字符串，再通过模板解析将字符串中的变量替换为真正的内容，随后再将字符串`json.Unmarshal`到该对象上覆盖原有属性值。这种设计也使得`Workflow Template`中的变量对应的内容必须是一个具体的值（字符串/数字等基本类型），不能是一个复杂对象，否则无法完成模板解析替换。

#### 5）多模板融合设计

在`Argo Workflow`中有三个地方可以设置`Template`运行模板，按照优先级顺序为：`Default Template、Workflow Template和Node Template`。

`**Default Template**`: 全局Template定义，所有创建的Workflow都会自动使用到该Template定义。

`**Workflow Template**`: Workflow流程中所有Node都会使用到的Template定义。

`**Node Template**`: 使用Steps/DAG流程调度的各个步骤/任务Node使用到的Template。

优先级高的`Template`在运行时会覆盖优先级低的`Template`，最终融合生成的Template再使用到`Pod`的创建中。

#### 6）简化的调度控制

`Argo Workflow`目前仅使用两种调度控制方式：`Steps`和`DAG`。

`Steps:` 通过步骤的先后顺序、并行/串行控制来调度执行任务。

`DAG:` 通过有向无环图，任务之间的依赖关系来调度执行任务。

并且这两种方式可以混合使用，使得`Argo Workflow`基本能满足绝大部分的任务调度业务场景。

### 3、核心结构

整个`Controller`逻辑中涉及到的核心数据结构如下。

| 数据结构 | 结构介绍 |
| --- | --- |
| `WorkflowController` | ![](/attachments/image2021-7-1_11-14-52.png)<br/><br/>用于`Workflow Controller`流程控制的核心数据结构对象，封装了主要的`Controller`处理逻辑、维护着核心的相关业务逻辑对象、数据队列、`KubeClient`对象、`Informer`对象等等。该结构只有一个对象实例，由主流程创建。 |
| `Workflow` | ![](/attachments/image2021-7-1_11-18-1.png)<br/><br/>`Workflow`的内容管理对象，用于`Workflow`的逻辑处理。 |
| `WorkflowSpec` | ![](/attachments/image2021-7-1_11-19-10.png)<br/><br/>`Workflow`的内容定义映射对象，与开发者使用的`yaml`文件结构一一对应。需要注意与`WorkflowStatus`的区别：<br/><br/>*   `WorkflowSpec`是`Workflow`的定义，来源于`Workflow Yaml`配置以及对象初始化。初始化完成后再运行时不会执行修改操作，运行时操作中只对`Spec`对象执行读取操作。<br/>*   `WorkflowStatus`是`Workflow`运行时的状态信息管理对象，因为状态信息会不断变化，因此内部的属性也会不停地被修改。 |
| `WorkflowStatus` | ![](/attachments/image2021-7-1_11-21-30.png)<br/><br/>`Workflow`逻辑处理流程中的运行时状态信息管理对象。该结构是与`Kubernetes Pod操作相关的资源结构。几点重要的说明：`<br/><br/>`1、StoredTemplates`<br/><br/>该属性是一个`Map`类型，存放了当前`Workflow`所有的`Template`对象，以便于全局访问。键名为生成的`TemplateID`，生成规则为：<br/><br/>`Scope/MetaName/TemplateName`<br/><br/>![](/attachments/image2021-7-1_17-42-37.png) |
| `WorkflowStep` | ![](/attachments/image2021-7-1_17-6-38.png)<br/><br/>是的，你没猜错，这个是用来管理执行流程控制的每一个操作步骤对象。该步骤对象必然会绑定一个`Template`对象。<br/><br/>`Workflow`的初始化执行步骤是通过`woc.execWf.Spec.Entrypoint` 作为入口`Template`。 |
| `wfOperationCtx` | ![](/attachments/image2021-7-1_11-27-8.png)<br/><br/>`Workflow`业务逻辑封装对象。<br/><br/>几点重要的说明：<br/><br/>1、`wf/orig/execWf`<br/><br/>1）`wf`<br/><br/>该对象是开发者通过`yaml`创建的`Workflow`对象的深度拷贝对象。官方注释建议运行时逻辑处理中应当使用`execWf`而不是`wf`对象，wf对象未来可能会被废弃掉。<br/><br/>2）`orig`<br/><br/>该对象是开发者通过`yaml`创建的`Workflow`对象，任何时候开发者都不应当去修改它，该对象主要用于后续可以对`Workflow`的`patch`更新判断。<br/><br/>3）`execWf`<br/><br/>该对象是运行时逻辑处理中修改的`Workflow`对象，因为`Workflow`对象会在逻辑处理中不断被修改更新，特别是`execWf`是多个模板`(Wf/WfDefault/WfTemplate)`的合并结构。<br/><br/>*   关于`TemplateDefault`的介绍请参考官方文档：[https://argoproj.github.io/argo-workflows/template-defaults/](https://argoproj.github.io/argo-workflows/template-defaults/)<br/>*   `WfTemplate`来源于`templateRef`配置，具体请参考官方文档：[https://argoproj.github.io/argo-workflows/workflow-templates/#referencing-other-workflowtemplates](https://argoproj.github.io/argo-workflows/workflow-templates/#referencing-other-workflowtemplates)<br/><br/>2、`globalParams`<br/><br/>全局变量，类型为`map[string]string`，该`Workflow`中的所有`template`共享该变量，该变量的名称也可被用于`template`中的模板变量。<br/><br/>3、`update`<br/><br/>该属性用于标识当前`Workflow`对象是否已更新，以便判断是否同步到`Kubernetes`中。<br/><br/>4、`node`<br/><br/>在`woc`处理流程的源码中会出现`node`的概念，这里的`node`是`Steps/DAG中`的执行节点，每一个节点都会运行一个`Pod`来执行。注意它和`Template`不是一个概念。 |
| `templateresolution.`<br/><br/>`Context` | ![](/attachments/image2021-7-1_16-56-26.png)<br/><br/>如注释所示，用于`Workflow`中的`template`检索。 |

### 4、核心流程

主要节点流程图：[https://whimsical.com/kubernetes-argo-controller-4BkPmeF1ZNP548D3JmaHhS@2Ux7TurymME7dMV1vz75](https://whimsical.com/kubernetes-argo-controller-4BkPmeF1ZNP548D3JmaHhS@2Ux7TurymME7dMV1vz75)

由于`Argo Workflow Controller`的细节很多、流程非常长，这里对流程做了精简，只保留了相对比较重要的执行节点，以便有侧重性进行介绍。

![](/attachments/KubernetesArgoController.png)

#### `1）WorkflowController`

*   `![](/attachments/image2021-7-2_10-6-9.png)  `

`Controller`启动是由`Cobra`命令行组件管理，通过`workflow-controller`命令执行启动。启动后创建`WorkflowController`对象，并执行该对象的`Run`方法将流程的控制交给了该对象维护。这里同时会创建一个`HTTP Serever:``6060/healthz`，用于`Controller容器`的健康检查。不过，从执行结果来看，`6060`端口的健康检查服务并没有被使用，而是使用的后续开启的`Metrics Http Server`作为健康检查的地址。

![](/attachments/image2021-7-2_10-23-20.png)

*   在初始化`WorkflowController`时会自动创建内部的一个`Informer`对象`Watch ConfigMap`的变化，当`argo`的相关`ConfigMap`更新后，会自动更新`wfc`的相关配置，包括数据库连接`Session`。

![](/attachments/image2021-7-2_15-42-36.png)

#### `2）wfController.Run`

`WorkflowCotroller`首先会进行大量的初始化操作，主要如下：

*   创建`wfc.wfInformer/wfc.wftmplInformer/wfc.podInformer/wfc.cwftmplInformer`并绑定相关的`Event Handler`，根据各自设定的`cache.ListWatch`规则对`Event`进行过滤（只会监听`argo`创建的相关资源）。例如：

![](/attachments/image2021-7-2_15-51-15.png)

*   创建`Metrics Http Server:9090`，用于`Prometheus`的指标上报，内部的指标有点多，可以单独创建一个话题来研究，这里就不深究了。
*   经典的`Kubernetes Client Leader`选举逻辑，当选出`Leader`时，在`Leader`节点通过`OnStartedLeading`回调进入`wfc.startLeading`逻辑。
*   `wfc.startLeading`中开始队列的开启、异步任务的创建，这里使用了`wait.Until`方法，该方法会每隔一段时间创建一个异步的协程执行。
*   这里涉及到3个队列的`worker`创建：`wfc.wfQueue/wfc.podQueue/wfc.podCleanupQueue`：
    *   `wfc.wfQueue` 用于核心的Workflow对象的创建/修改流程控制。
    *   `wfc.podQueue` 用于`Pod`的更新，其实就是当`Pod`有更新时如果`Pod`还存在，那么重新往`wfc.wfQueue`中添加一条数据重新走一遍`Workflow`的流程对`Pod`执行修改。
    *   `wfc.podCleanupQueue` 用于`Pod`的标记完成。关闭：先关闭`main container`，再关闭`wait container`（关闭时先发送`syscall.SIGTERM`再发送`syscall.SIGKILL`信号）。删除：直接从`Kubernetes`中`Delete`该`Pod`。
    *   官方的架构图中也能看得到几个队列之间的关联关系。

![](/attachments/image2021-7-2_16-19-31.png)

 

#### `3）wrc.wfQueue`

`wfc.wfQueue`是最核心的一个消息队列，接下来我们主要学习对于该队列的业务逻辑处理。

#### `4）util.FromUnstructured`

由于我们的`wfc.wfInformer`使用的是`dynamicInterface`过滤类型，因此所有的事件对象都是`unstructured.Unstructured`对象（其实是一个`map[string]interface{}`），无法直接通过断言转换为`Workflow`对象。因此这里使用了`util.FromUnstructured`方法将`unstructured.Unstructured`对象转换为`Workflow`对象。

#### `5）newWorkflowOperationCtx`

该方法会创建核心的`wfOperationCtx`对象，该对象是在`Workflow`处理中核心的上下文流程和变量管理对象，接下来`wfc(WorkflowController)`会将业务逻辑的流程控制转交给`woc(wfOperationCtx)`来管理。我们可以这么来理解，`wfc`是一个`Kubernetes Controller`，用于`CRD`的实现，负责与`Kubernetes Event`打交道。`woc`负责内部的业务逻辑、流程、变量管理，因此`woc`是`Workflow`处理中的核心业务逻辑封装对象。

#### `6）woc.operate`

毫无疑问地，接下来的控制权转交给了`woc(wfOperationCtx)`，通过`woc.operate`进入业务逻辑处理流程。

![](/attachments/image2021-7-2_16-37-11.png)

![](/attachments/image2021-7-2_16-38-49.png)

#### `7）woc.setExecWorkflow`

*   通过`woc.execWf`属性对象设置`woc`的`volumes`磁盘挂载。
*   通过`woc.setGlobalParameters`设置`woc`的`globalParams`全局变量。
*   通过`woc.substituteGlobalVariables`解析`woc.execWf.Spec`中的模板变量。

#### `8）woc.createTemplateContext`

通过`woc.CreateTemplateContext`创建`templateresolution.Context`，该对象用于`Workflow`中的`template`检索。

#### `9）woc.substituteParamsInVolumes`

通过`woc.substituteParamsInVolumes`方法解析替换`Volume`配置中的变量内容。

#### `10）woc.createPVCs`

通过`woc.createPVCs`方法根据`woc.execWf.Spec.VolumeClaimTemplates`配置创建`PVC`。

#### `11）woc.executeTemplate`

*   通过`woc.executeTemplate`方法开始执行`Workflow`中的`Template`，入口为`woc.execWf.Spec.Entrypoint`。

![](/attachments/image2021-7-1_17-28-40.png)

*   内部会根据给定的`Entrypoint`先去`StoredTemplates`检索对应的`Template`对象，找到之后对该`Template`对象做深度拷贝并返回该拷贝对象。如果找不到则去`Workflow`对象中查找，并缓存、返回查找到的`Template`对象。

#### `12）woc.mergedTemplateDefaultsInto`

关于什么是`TemplateDefaults`请参考章节介绍：[https://argoproj.github.io/argo-workflows/template-defaults/](https://argoproj.github.io/argo-workflows/template-defaults/)

通过`woc.mergedTemplateDefaultsInto`方法将用户配置的`TemplateDefaults`合并到当前操作的`Template`对象上。

#### `13）common.ProcessArgs`

`common.ProcessArgs`方法主要用于`Template`的模板变量解析。

![](/attachments/image2021-7-2_19-43-57.png)

注意：`argo`内部中的变量分为两种，一种是`Workflow`全局生效的变量(`globalParams`)，一种是当前`Template`生效的本地变量(`localParams`)。其中全局变量也包括开发者自定义的输入/输出变量、`Workflow Annotations&Labels`，这些变量也是能被`Workflow`全局中访问。

![](/attachments/image2021-7-2_19-35-40.png)

![](/attachments/image2021-7-2_19-30-46.png)

在模板变量解析中，还有一个关键的点。`Argo`的模板变量是支持表达式的，表达式解析是使用 `github.com/antonmedv/expr` 组件。

![](/attachments/image2021-7-3_14-38-26.png)

#### `14）processedTmpl.Memoize`

`processdTmpl.Memoize`配置用于开发者自定义是否缓存当前`Template`执行结果，具体介绍请参考章节：[https://argoproj.github.io/argo-workflows/memoization/#using-memoization](https://argoproj.github.io/argo-workflows/memoization/#using-memoization)

#### `15）processedTmpl.GetType`

接下来是`Template`执行的关键地方，根据不同的`Template`类型，执行不同的操作逻辑。从流程图中可以看到，最关键的是`Container`类型，以及`Steps&DAG`类型。其中`Container`类型是所有`Template`执行的终点，也就是说`Template`执行最终是需要一个容器来实现。而`Steps&DAG`类型用于控制用户编排的`Template`流程，通过循环执行的方式，最终也会落到`Container`类型中去执行。

![](/attachments/image2021-7-2_20-29-45.png)

*   **Suspend**

Suspend类型的Template通过woc.executeSuspend方法实现，内部只是将当前的Template标记一下更新时间和Suspend的时间并重新丢回队列以便下一次判断。



*   `**Script**`

`Script`类型的`Template`通过`woc.executeScript`方法实现，内部判断当前的`Script`是否有其他`Template`在使用，随后调用`woc.createWorkflowPod`创建`Pod`到`Kubernetes`中。



*   `**Resource**`

`Resource`类型的`Template`通过`woc.executeResource`方法实现，`Resource`内容通过创建一个`argoexec`容器，并使用 `argoexec resource` 命令解析参数，容器创建通过调用`woc.createWorkflowPod`创建`Pod`到`Kubernetes`中。



*   `**Data**`

`Data`类型的`Template`通过`woc.executeData`方法实现，`data`内容通过创建一个`argoexec`容器，并使用 `argoexec data` 命令解析参数，容器创建通过调用`woc.createWorkflowPod`创建`Pod`到`Kubernetes`中。



*   `**ContainerSet**`

`ContainerSet`类型的`Template`通过`woc.executeContainerSet`方法实现，多个容器的创建通过调用`woc.createWorkflowPod`创建`Pod`到`Kubernetes`中。关于`ContainerSet`类型的`Template`介绍请参考：[https://argoproj.github.io/argo-workflows/container-set-template/](https://argoproj.github.io/argo-workflows/container-set-template/)



*   `**Steps & DAG**`

`Steps&DAG`类型的`Template`通过`woc.executeSteps`、`woc.executeDAG`方法实现，内部会对多个`Template`的流程进行控制，循环调用`woc.executeTemplate`方法执行每个`Template`。



*   `**Container**`

这部分是整个`Workflow Controller`调度的关键，是创建`Pod`的核心逻辑。`Container`类型的`Template`通过`woc.executeTemplate`方法实现。在该方法中，涉及到几点重要的`Pod`设置：

a）根据条件创建`Init/Wait Containers`，内部都是通过 `woc.newExecContainer ` 创建容器，容器创建时并设置通用的环境变量以及`Volume`挂载。

![](/attachments/image2021-7-3_10-58-40.png)

![](/attachments/image2021-7-3_10-52-34.png)

b）`addVolumeReferences` 根据将开发者自定义的`Volume`，按照名称关联挂载到`Pod的Init/Wait/Main  Containers`中。

c）`addSchedulingConstraints` 方法根据`WorkflowSpec`的配置来设置`Pod`调度的一些调度策略，包括：`NodeSelector/Affinity/Tolerations/SchedulerName/PriorityClassName/Priority/HostAliases/SecurityContext`。

d）`woc.addInputArtifactsVolumes` 对于`artifacts`功能特性来说是一个很重要的方法，将`Artifacts`相关的`Volume`挂载到`Pod`中，这些`Volume`包括：`/argo/inputs/artifacts` 、 `/mainctrfs`以及开发者在配置中设置的`Volume`地址。

如果`Template`类型为`Script`，那么会增加挂载一个 `/argo/staging` 的`emptyDir`类型的`Volume`，用于`Init/Wait/``Main Containers`之间共享`Resource`内容。我们来看一个官方的例子`(scripts-bash.yaml)`：

![](/attachments/image2021-7-5_19-53-5.png)

在使用`artifacts`配置的时候，它会创建一个名称为 `inputs-artifacts` 的`emptyDir`类型volume供`Init/Wait/Main  Containers共享artifacts数据。我们来看一个官方的例子(artifacts-passing.yaml)：`

`![](/attachments/image2021-7-5_19-48-52.png)  `

e）`addInitContainers &  addSidecars &  ` `addOutputArtifactsVolumes` 将`Main Containers`中的`Volume`同步挂载到`Init/Wait Containers`中，以便于共享数据。从一个示例可以看到，`Main Containers`中的`Volume`在`Init/Wait Containers`中都有。

![](/attachments/image2021-7-3_11-15-51.png)

f）一些固定的环境变量设置，注意其中的`Template`环境变量设置，将整个`Template`对象转换为`Json`后塞到环境变量中，以便于后续容器读取：

![](/attachments/image2021-7-3_10-23-46.png)

![](/attachments/image2021-7-3_10-24-12.png)

g）`substituePodParams` 最后一次变量替换，特别是来源于`Workflow ConfigMap`或者`Volume`属性的变量。

h）`kubeclientset.CoreV1.Pods.Create` 将之前创建的`Pod`提交到`Kubernetes`执行创建。

![](/attachments/image2021-7-3_10-37-11.png)

## 五、ArgoExec Container

### 1、核心结构

整个`agoexec`逻辑中涉及到的核心数据结构如下。

| 数据结构 | 简要介绍 |
| --- | --- |
| `WorkflowExecutor` | ![](/attachments/image2021-7-3_10-37-11.png)<br/><br/>用于`Init/Wait Containers`的运行管理核心对象。 |
| `ContainerRuntimeExecutor` | ![](/attachments/image2021-7-3_11-1-26.png)<br/><br/>如注释所示，用于与`Docker Container`进行交互的`API`接口。 |
| `Artifact` | ![](/attachments/image2021-7-3_11-32-4.png)<br/><br/>`Artifact`资源管理对象。 |
| `ArtifactDriver` | ![](/attachments/image2021-7-3_11-27-19.png)<br/><br/>![](/attachments/image2021-7-3_11-31-15.png)<br/><br/>用于`Artifacts`的驱动管理。`Argo`默认支持多种`Artifacts`驱动。 |
| `ArchiveStrategy` | ![](/attachments/image2021-7-3_11-36-44.png)<br/><br/>`ArchiveStrategy`用以标识该`Artifact`的压缩策略。 |

### 2、`ArgoExec Init`

只有在`Template`类型为`Script`或者带有`Artifacts`功能时，`Argo Workflow Controller`才会为`Pod`创建`Init Container`，该`Container`使用的是`argoexec`镜像，通过 `argoexec init` 命令启动运行。`Init Container`主要的职责是将`Script`的`Resource`读取或将依赖的`Artifacts`内容拉取，保存到本地挂载的共享`Volume`上，便于后续启动的`Main Container`使用。

![](/attachments/image2021-7-3_11-41-5.png)

由于`Init Container`的执行流程比较简单，这里简单介绍一下。

#### 1）`iniExecutor & wfExecutor.Init`

首先创建`WorkflowExecutor`对象，该对象用于`Init/Wait Containers`的核心业务逻辑封装、流程控制执行。

在`WorkflowExecutor`对象创建时会同时创建`ContainerRuntimeExecutor`对象，用于`Docker Container`的交互，包括`Docker`终端输出读取、结果文件获取等重要操作。在默认情况下，`WorkflowExecutor`会创建一个`DockerExecutor`对象。

![](/attachments/image2021-7-3_11-53-2.png)

此外，大家可能会对于为何能与`Pod`内部的`Container`交互，并且如何获取到`Docker`的输出内容感觉好奇。那我们`describe`一个`Pod`来看大家也许就明白了：

`![](/attachments/image2021-7-3_11-56-38.png)  `

可以看到，容器中挂载了`docker.dock`文件到本地，以便本地可以通过`docker`命令与`docker`进行交互。当然`Init Container`不会直接与`Docker`交互，往往只有`Wait Container`才会，所以`Init Container`中并没有挂载该`docker.sock`文件。

#### `2）wfExecutor.StageFiles`

`wfExecutor.StageFiles`方法用于将`Script/Resource`（如果有）以文件形式存写入到本地挂载的`Volume`位置，这些`Volume`是`Container`之间共享后续操作，后续`Main Container`会通过共享`Volume`访问到这些文件。需要注意的是，不同的`Template`类型，内容来源以及写入的磁盘位置会不同：

![](/attachments/image2021-7-3_11-59-59.png)

#### 3）`wfExecutor.LoadArtifacts`

该方法仅在使用了`Artifacts`功能的场景下有效。负责将配置的`Artifact`拉取到本地，并根据压缩策略进行解压，修改权限，以便下一步`Main Container`访问。为便于扩展，`Artifacts`使用了`ArtifactDrive`接口设计，不同类型的`Artifact`可以分开实现，并根据类型进行引入，通过接口进行使用。

### 3、`ArgoExec Wait`

所有的`Argo Workflow Template`在执行时都会创建一个`Wait Container`，**这是一个非常关键的`Container`**。该`Container`负责监控 `Main Container`的生命周期，在 `Main Container` 中的主要逻辑运行结束之后，负责将输出部分读取、持久化，这样 `Main Container` 就不用操心如何将该步产生的结果传到后面的步骤上的问题。

![](/attachments/image2021-7-3_13-54-35.png)

由于`Wait Container`的执行流程比较简单，这里简单介绍一下。

#### 1）`wfxecutor.Wait`

该方法用于等待`Main Container`完成，我们看看默认的`DockerExecutor`底层是怎么实现的：

![](/attachments/image2021-7-3_13-41-38.png)

#### 2）`wfExecutor.CaptureScriptResult`

通过捕获`Main Container`的终端输出，并保存输出结果。**需要特别注意**的是执行结果的大小，如果超过`256KB`将会被强行截断。

![](/attachments/image2021-7-6_14-38-0.png)

#### 2）`wfExecutor.SaveLogs`

保存日志，默认情况下会保存到`argo`自带的`minio`服务（使用`S3`通信协议）中，该日志也可以被`Argo Server`中访问展示。

![](/attachments/image2021-7-3_13-47-50.png)

`Argo`默认的`ArtifactRepository`：

![](/attachments/image2021-7-5_17-48-35.png)

#### 3）`wfxecutor.SaveParameters`

只有在`Template`中存在`Outputs`配置时才会执行该逻辑，该方法将容器执行的结果保存到当前 `Template.Outputs.Parameters` 中。

![](/attachments/image2021-7-3_13-59-11.png)

#### 3）`wfxecutor.SaveArtifacts`

如果`Template`存在`Artifacts`操作时，该方法用于读取`Main Container`中的`Artifacts`保存到 `/mainctrfs` 目录，并且解压（`untar/unzip`）后保存临时目录`/tmp/argo/outputs/artifacts`下，随后将临时目录中的`Artifacts`文件将上传到`Artifact Repository`中。值得注意的是：

*   `/mainctrfs` 目录是`Wait Container`与`Main Container`的共享`Volume`，因此直接文件`Copy`即可。这是内部`Volume`交互，文件都是压缩（`tgz`）过后的，无须解压。
*   临时目录 `/tmp/argo/outputs/artifacts`下的`Artifacts`文件只是用于后续的`ArtifactDriver`上传到`Artifact Repository`中，并且上传的文件内容需要实现解压（`untar/unzip`），因为压缩的机制只是`argo`内部文件交互使用，并不对外部`ArtifactDriver`通用。
*   默认的`ArtifactRepository`是`minio`，因此执行结果也会保存到`minio`服务中。

![](/attachments/image2021-7-3_14-17-9.png)

#### 4）`wfExecutor.AnnotateOutputs`

`Wait Container`最后这一步操作很有意思。但是可能会使得`Metadata`中的`Annotation`会变得比较大。使用时需要注意，`Annotation`本身是有大小限制的，`Kubernetes`对于该项默认大小限制是`256KB`。

![](/attachments/image2021-7-3_14-20-25.png)

![](/attachments/image2021-7-3_14-25-18.png)

这个`Annotations`会在`Workflow Controller`调度时被自动读取出来设置到`Template`的`Outputs`属性中，这样一个`Template`执行的输出便可以被其他关联的`Template`引用到：

![](/attachments/image2021-7-3_14-25-18.png)

归根到底，从底层实现来讲，多个`Template`传递流程数据的方式主要依靠`Annotations、Artifacts`及共享`Volume`。

### 4、ArgoExec其他命令

`ArgoExec`的其他命令（`data/resource/emissary`）主要用于流程调度过程中的内容解析，比较简单，这里不再做介绍，感兴趣可以看下源码。

## 六、常见问题

`Argo Workflow`的流程和主要逻辑梳理完了，接下来我们回答最开始的那几个问题。

由于篇幅较长，我们将问答内容迁移到了这里：[Argo Workflow常见问题](./3-Argo%20Workflow常见问题/3-Argo%20Workflow常见问题.md)

    