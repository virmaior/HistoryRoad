# History Road

This is a tool to provide a wrapping series of events with an easy to see visual tracing between them.

# Background

In May 2026, I returned from a trip to visit and help family. Shortly thereafter my pet squirrel and friend died. We wanted to memorialize her life and to represent that series of events in a loving way that didn't end up looking just like a table.

I tried using tools like mermaid.js and excalidraw but they were not well suited to this particular application. So instead, I wrote my own.

# Data

Basically, it uses JSON. This can either be loaded using a string that is converted to JSON or passed directly as JSON.

## Configuration Reference

a "bounce" is the degree to which a History Square is not at straight 90 degree angles.

### `ConfigData` Interface Structure

| Property | Type | Description |
| :--- | :--- | :--- |
| `settings` | `object` | Core configuration settings object. |
| `bounces` | `object` | Collection of hard-coded "bounces". |


### `Config` settings Options

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `palette` | `string` | `brown` | This picks the color scheme for the history road. |
| `offsetStart` | `number` | `0` | How many boxes to skip before starting. |
| `baseWidth` | `number` | `4` | Base width setting. |
| `rowItemCount` | `number` | `4` | Number of items rendered per row. |
| `pathWidth` | `number` | `20` | Width of the path layout in pixels. |
| `baseBounce` | `number` | `20` | Baseline "bouncing" level. The higher this is the more objects will naturally tend to have angles. |
| `hLineType` | `'slope' \| 'straight'` | `'slope'` | Horizontal line style type. Basically "slope" means it will go from top to bottom as it goes left to right (or on opposite lines right to left). Straight means there will be no such trajectory. |
| `hBrushVary` | `number` | `2` | Variance threshold for the horizontal brush. |
| `drainTop` | `number` | `0.2` | How far up the top of the side of the first history square in a row to start the trace line. |
| `drainMid` | `number` | `0.5` | How far to the middle of the side of the first history square in a row to start the trace line. |
| `wrapLineTypes` | `wrapLineType[]` | `['drop', 'curve']` | Array specifying permitted line wrapping behaviors (`'drop'` or `'curve'`). |


### Config `Brushes` Options
This needs to contain your brush information. Since my original use case was for a flying squirrel, the brush color patterns match that but the important part is that for the SVG they need to be id="brush1" and id="brush2". Brush 1 manages how the brush looks on a line; Brush 2 manages wrapped cases


### Config `Bounces` Options
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| index | `number` OR `hash` | ... | This tells history road which item you're configuring bounces for. This can be either the sequential index, matched to the hash generated automatically, or matched to a manually set hatch. |
| `base` | `number` | `0` | This sets the bounce value for the overally history square. |
| `box` | `number` | `4` | This sets the bounce value for the focus box in the square. |


## History Squares JSON

### Example:
```
[
  {
    "startDate": "2023-08-15",
    "text": { "eText": "Born in Saitama", "jText": "埼玉県生まれ" },
    "width":4,
    "box":  {
      "boxType": "quote",
      "content": {
        "quote": {
          "eText": "Acquired pilot’s license (gliding) <br /> Studied anthropology",
                    "jText": "推測：操縦士（滑空）資格を受かった<br />人類学の勉強 。"
        },
        "author": "GK"
      }
    } 
  },
  {
    "startDate": "2024-06-15",
    "text": { "eText": "Arrived in Asahikawa to be a field anthropologist.", 
              "jText": "フィールド・アンソロポロジスト（長期で現地にいく人類学者）として旭川に着任。" 
            },
    "width": 5,
    "box":{ "boxType": "image", 
            "content" : {
                  "src": "dist/1.jpg",
                "alt":"arrival" 
            }
          } 
  },
  {   
      "startDate": "2024-06-15",
      "text": { "eText": "Meeting us at the Airport.", 
      "jText": "空港で出会った。" },
      "width": 5 ,
          "box":{ "boxType": "image", 
            "content" : {
                  "src": "dist/11.jpg",
                "alt":"humans" 
            }
          } 
    },
  {
    "startDate": "2024-06-15",
     "endDate": null,
     "text":{ "eText":  null, "jText": null},
     "box": {"boxType": "list", 
              "content": [ 
               "巣作り. Settled in",  
               "本物の食べ物へ変更した。Changed to “eat real food diet”",
               "XXXのケアチームに入った。Joined the care team for XXX"
               ] 
      },
      "width":5
  },
  {
      "hash":"emkzsk",
      "startDate": "2024-06-15",
      "width":5,
      "text": { "eText": "Started conversing with Z at home." , 
                "jText": "自宅でザッ君と初会話。" },
      "box":{ "boxType": "image", 
                    "content" : {
                          "src": "dist/12.jpg",
                          "alt":"two squirrels" 
                    }
  }}, 
        
  {
    "startDate": "2024-06-16",
    "palette": "green",
    "text": { "eText": "Took almond dust from YYY", "jText": "手に乗って" },
     "box":{ "boxType": "image", 
                            "content" : {
                                 "src": "dist/2.png",
                                "alt":"on hand" 
                            }
                        }  
  },
    {
    "startDate": "2024-06-16",
    "palette": "green",
    "text": { "eText": "Went up YYY’s arm into the living room and inspected it directly for the first time.",
             "jText": "手を登って、リビングの初探検" },
     "box":{ "boxType": "image", 
                            "content" : {
                                 "src": "dist/3.png",
                                "alt":"on shoulder" 
                            }
                        }  
  },
  {
    "startDate": "2024-06-17",
    "endDate": null,
    "text": { "eText": "Began research on flight (gliding), climbing, humans, and their clothing.", "jText": "研究所の女子部屋で飛行（滑空）、クライミング、人間、衣類学の研究活動開始" },
     "box":{ "boxType": "image", 
                            "content" : {
                                 "src": "dist/4.jpg",
                                "alt":"on cage" 
                            }
                        }  ,
      "width": 6
  },
  {
    "startDate": "2024-07-05",
    "text": { "eText": "Ate first raspberry", "jText": "初の木苺" },
    "width": 2
  }
```

### Explanation
This is an array of JSON objects, each object looks like:


```
export interface RawSquareData {
    startDate: string;
    endDate?: string | null;
    text: mlText;
    box?: null | BoxInfo;
    hash? : string;
    width?: number;
    palette? : string | null;
}
```

It **must** contain
1.  startDate 
2. mlText - this is two string eText and jText to display the information in English and Japanese respectively.

It *can* contain 
1. hash - which specifies how to identify this box regardless of sequence.
2. width - this identifies how wide the element is by overriding the default widths. Otherwise it defaults to the default width in the configuration.

It *can* contain 
1. endDate - for events that cover multiple days
2. box - a focus box which can be (a) a quote, (b) a list, or (c) image
3. palette - this will override the palette colors for this particular box


### Boxes

The boxes contain a "boxtype" that tells history road what sort of information is there.

## Box Configuration Reference

The `box` object structural schema varies depending on the specified `boxType`. Below are the available types, their expected structural patterns, and descriptions of their inner `content` properties.

### `box` Types and Schema Definitions

| `boxType` | `content` Structure | Field Details | Description / Example Use Case |
| :--- | :--- | :--- | :--- |
| **`"quote"`** | `object` | <ul><li>`quote`: `object` (`eText`: string, `jText`: string)</li><li>`author`: `string`</li></ul> | Displays a localized quote. |
| **`"image"`** | `object` | <ul><li>`src`: `string` (relative file path)</li><li>`alt`: `string` (accessibility/fallback description)</li></ul> | Standard image block containing asset path references. |
| **`"list"`** | `array` | <ul><li>`content`: `string[]` (array of text items)</li><li>Supports multilingual inline strings</li></ul> | Displays a list of items in ul/li structure. |

* Remember `box` is optional!
* Right now, the `author` field is not displayed.


# Using
Use `tsc` to compile this into JavaScript and use it there.

# Printing
Printing is a bit tricky so I've included a `screenshot.ts` implementation that will make it work.
Generally ` npx tsx src/screenshot.ts` will produce a good screenshot.
It also does okay with printing now due to event trapping that redoes the SVG before and after attempting to print.

# Limitations

* Right now, author field does nothing.
* One thing I wanted to add is to have the path line be able to be wider than the objects but this is not presently implemented.
* The CSS defaults to a flying squirrel brown pallette like the brushes. There are also options for red, blue, gray, and green.
* There's no WYSIWYG editing.
* The lines choices are not fully functional.

# Screenshot
<img width="6144" height="3323" alt="sample" src="https://github.com/user-attachments/assets/ba91dfd8-4933-4bcf-a7ba-d3e9bc3d7e68" />
