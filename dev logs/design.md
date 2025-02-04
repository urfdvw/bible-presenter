# 设计要求

## 功能点

基本功能
- 经文检索工具
    - 快速定位（和之前的版本保持一致）
    - 目录
    - 文字搜索
- 回放功能
    - 历史记录
    - 预设程序
- 播放功能
    - 单屏优化
    - 投影优化
    - 连续经文显示
    - 单屏经文片段显示

增强功能
- 回放中可以加入markdown 撰写的幻灯片

## 工作流


## 功能实现
- useBibleData
    - input
        - bible data files
        - bible version config
    - output
        - getNextVerse
        - getVerseText
            - given start and end verse
            - return verse text, all version
        - getRangeText
            - given start and end verse
            - return a text mentioning verse range

## 变量名
- verse/verse obj: 数据库里的 verse object
- VerseIndex：一组 bcv数字组合
- VerseText：经文内容
- RangeText：经文范围的说明
