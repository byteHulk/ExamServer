## /getExamLists
* method:'get'
* properties:
    empty

## /getQuestion
* method:'post'
* properties:
    field:
        type: string
        description: 场次
    quesNum:
        type: string
        description: 题号

## /getAns
* method:'post'
* properties:
    field:
        type: string
        description: 场次
    quesNum:
        type: string
        description: 题号
    ans:
        type: string
        description: 答案

