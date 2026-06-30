const config = {
    'settings': {
        baseWidth: 4,
        rowItemCount: 4,
        pathWidth: 20,
        baseBounce: 20,
        drainTop: 0.2,
        drainMid: 0.5,
        hLineType: 'slope',
        offsetStart: 2,
        palette: "gray"
    },
    "bounces":
    {
        0: { "base": -30},
        "tt1" : { "base" : 0, "box" : 0},
        "cdf" : { "base" : 19 , "box": 40}
    }
}

const historyRoadJson =
    [
        {
            'width' : 3,
            'palette': 'green',
            'startDate': '2025-10-01',
            'text': { "eText": "Explained Class, Provided Syllabus", "jText": "授業の説明とシラバス配布" }
        },
        {
            'startDate': '2025-10-08',
            'text': { "eText": "Introduced Statement/Premise/Conclusion", "jText": "命題と前提と結論の概要の紹介" }
        }, {
            'startDate': '2025-10-15',
            'text': { "eText": "Indicator Words and Clarity", "jText": "明瞭性と論証の指標" }
        },
        {
            'startDate': '2025-10-22',
            'text': { "eText": "Factors of Clarity", "jText": "明瞭性の要素" },
            "box": {
                "boxType": "list",
                "content": [
                    "Concrete - 具体的",
                    "Concise - 簡潔性",
                    "Consistent - 一貫している"
                ]
            },
            "width": 4
        },
        {
            'startDate': '2025-10-29',
            'text': { "eText": "Charitable Reading", "jText": "寛容の原則" }
        },
        {
            'startDate': '2025-11-05',
            'palette': 'red',
            'text': { "eText": "Test 1", "jText": "第一試験" }
        },
        {
            'startDate': '2025-11-12',
            'text': { "eText": "Logical Operators", "jText": "論理的結子" },
            "box": {
                "boxType": "list",
                "content": [
                    "NOT - 否定",
                    "AND - 連言",
                    "OR - 選言",
                    "IF/THEN - 条件法"
                ]
            },
            "width" : 5

        },
        {
            'hash' : 'cdf',
            'startDate': '2025-11-19',
            'text': { "eText": "Common Deductive Forms", "jText": "伝統的演繹的論のパターン" },
            "box" : {
                "boxType" : "quote",
                 "content" : { 'quote': 
                    { "eText": "There are five common patterns of deductive arguments: Modus Ponens, Modus Tollens, Disjunctive Syllogism, Hypothetical Syllogism, and Dilemma.", 
                        "jText": "伝統的に５類の演繹的論証が存在します。それは肯定式、否定式、選言的三段論法、推移律、及び構成的ジレンマ" } }

            }
        },
        {
            'startDate': '2025-12-03',
            'text': { "eText": "Fallacies: Affirming the Consequent, Denying the Antecedent", "jText": "誤謬：後半肯定、前半否定" }
        },
        {
            "hash": "tt1",
            'startDate': '2025-12-03',
            'text': { "eText": "Truth Tables", "jText": "真理表" },
            "box":{ "boxType": "image", 
            "content" : {
                  "src": "sample/1.png",
                "alt":"arrival" 
            }
          } 
        },
        {
            'startDate': '2025-12-10',
            "width": 8,
            'text': { "eText": "Truth Tables Continued", "jText": "真理表（続）" },
                "box":{ "boxType": "image", 
            "content" : {
                  "src": "sample/2.png",
                "alt":"arrival" 
            }
          } 
        },

        {
            'startDate': '2025-12-17',
            'palette': 'green',
            'text': { "eText": "Review", "jText": "復習" }
        },
        {
            'startDate': '2025-12-24',
            'palette': 'red',
            'text': { "eText": "Test 2", "jText": "第二試験" }
        },
            {
            'startDate': '2025-12-24',
            'text': { "eText": "Arguments by Analogy and Fit", "jText": "類推と適切性" }
        },
                    {
            'startDate': '2026-01-04',
            'text': { "eText": "Problem of Induction and Causation", "jText": "帰納の問題及び因果推論" }
        },

        {
            'startDate': '2026-01-11',
            'text': { "eText": "Inductive Generalizations", "jText": "帰納的一般化" }
        },
                {
            'startDate': '2026-01-18',
            'text': { "eText": "Strength and Weakness in Inductive Arguments", "jText": "帰納的論証の強さと弱さ" }
        },

        {
            'startDate': '2026-01-25',
            'palette': 'red',
            'text': { "eText": "Test 3", "jText": "期末試験" }
        }
    ];

