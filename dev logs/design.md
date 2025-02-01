# 设计要求

## 功能点

基本功能
- 经文检索工具
    - 快速查找（和之前的版本保持一致）
    - 文字搜索
    - 目录查找
- 回放功能
    - 历史记录
    - 预设经文
- 播放功能
    - 单屏优化
    - 投影优化
    - 连续经文显示
    - 单屏经文片段显示

备选功能
- 回放预设功能的时候可以加入markdown 撰写的 notes

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
- Verse：一组 bcv数字组合
- VerseText：经文内容
- RangeText：经文范围的说明
