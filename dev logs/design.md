# 设计要求

## 功能点

基本功能

-   经文检索工具
    -   快速定位（和之前的版本保持一致）
    -   目录
    -   文字搜索
-   回放功能
    -   历史记录
    -   预设程序
-   播放功能
    -   单屏优化
    -   投影优化
    -   连续经文显示
    -   单屏经文片段显示

增强功能

-   回放中可以加入 markdown 撰写的幻灯片

## 工作流

## 功能实现

-   bible data flow
    -   useBibleData hook: index to verses functions but with versions
        -   usage: index to verses functions
            -   singleton defined in App
            -   parsed in context used in end components
        -   dependency
            -   get current version
            -   index to verses functions
    -   verses express functions
        -   imported in end components
        -   used immediately after index to verses functions from hook

## 变量名

-   verse/verse obj: 数据库里的 verse object
-   verses: verses array of version array
-   VersePosition：一组 bcv 数字组合
-   VerseIndex：经节在全书数据中的位置
-   VerseText：经文内容
-   RangeText：经文范围的说明
