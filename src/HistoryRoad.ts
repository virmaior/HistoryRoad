type wrapLineType = 'drop' | 'curve';

type brushSet = string[];
interface Config {
    readonly palette: string; //  
    readonly baseWidth: number;
    readonly rowItemCount: number;
    readonly pathWidth: number;
    readonly baseBounce: number;
    readonly hLineType: 'slope' | 'straight',
    readonly hBrushVary: number;
    readonly drainTop: number;
    readonly drainMid: number;
    readonly wrapLineTypes: wrapLineType[];
    readonly offsetStart: number;
}

export interface ConfigData {
    settings: object;
    bounces: object;
}

const CONFIG: Config = {
  palette: 'brown',
  offsetStart: 0,
  baseWidth: 4,
  rowItemCount : 4,
  pathWidth: 20,
  baseBounce: 20,
  hLineType: 'slope',
  hBrushVary : 2,
  drainTop: 0.2,
  drainMid: 0.5,
  wrapLineTypes: ['drop','curve'] 
};

export type FocusBoxType = 'image' | 'list' | 'quote';
export type ImageContent = { src: string; alt: string };
export type ListContent = string[];
export type mlText = { eText: string | null; jText: string | null; };
export type QuoteContent = { quote: mlText; author: string; qDate: Temporal.PlainDate | null };
export type BoxContent = ImageContent | ListContent | QuoteContent | null;
export type Direction = 'L' | 'R';
export type biSeq = {  seq: number, dir: Direction };
export type Position = { row:number, col: number  };
export type bounceInfo = {base: number, box?: number };

export interface Bounces {
  [id: number | string]: bounceInfo;
}

export interface BoxInfo {
    boxType: FocusBoxType;
    content: BoxContent; 
}

interface Point {
    x: number;
    y: number;
}

export interface RawSquareData {
    startDate: string;
    endDate?: string;
    text: mlText;
    box?: BoxInfo;
    hash? : string;
    width?: number;
    palette? : string ;
}

export abstract class FocusBox<T = BoxContent> {
    constructor(
        public boxType: FocusBoxType,
        public content: T
    ){}

    abstract render(): string;

    // FIX 1: Explicitly narrowing 'content' to matching types so subclasses accept them without 'any' errors
    static make(btype: FocusBoxType, content: BoxContent): FocusBox<any> {
        switch (btype) {
            case 'list':
                return new ListBox(content as ListContent);
                
            case 'image':
                return new ImageBox(content as ImageContent);
                
            case 'quote':
                return new QuoteBox(content as QuoteContent);
                
            default:
                const _exhaustiveCheck: never = btype;
                throw new Error(`Unknown FocusBox type: ${_exhaustiveCheck}`);
        }
    }
}

export class ListBox extends FocusBox<ListContent> {
    constructor(content: string[]) {
        super('list', content);
    }

    render(): string {
        const listItems = this.content.map(item => `  <li>${item}</li>`).join('\n');
        return `<ul class="focus-box-list">\n${listItems}\n</ul>`;
    }
}

export class ImageBox extends FocusBox<ImageContent> {
    constructor(content: ImageContent) {
        super('image', content);
    }

    render(): string {
        return `<div class="imgDIV"><img src="${this.content.src}" alt="${this.content.alt}"  /></div>`;
    }
}

export class QuoteBox extends FocusBox<QuoteContent> {
    constructor(content: QuoteContent) {
        super('quote', content); 
    }

    render(): string {
        let out: string[] = [];
        if (this.content.quote.eText) { 
            out.push(`<span class="eText">${this.content.quote.eText}</span>`);
        }
        if (this.content.quote.jText) {
            out.push(`<span class="jText">${this.content.quote.jText}</span>`);
        }
        if (this.content.qDate) {
            out.push(`<span class="qDate">${this.content.qDate.toString()}</span>`);
        }
        return `<div class="focus-box-quote">${out.join('')}</div>`;
    }
}

export class Square {
    public sqBox: FocusBox<any> | null = null; 
    public hashValue: string | null = null;
    private width: number | null = null;
    private palette : string  | null = null;

    constructor(
        public startDate: Temporal.PlainDate, 
        public endDate: Temporal.PlainDate | null,
        public text: mlText,
        box: BoxInfo | null,
        hash: string | null,
        width?: number ,
        palette?: string 
    ) {
        if (box) {
            this.sqBox = FocusBox.make(box.boxType, box.content); 
        }
        if (hash) { this.hashValue = hash; }
        if (width) { this.width = Number(width); }
        if (palette) { this.palette = palette; }
     }

    get hash(): string {
        if (this.hashValue) { return this.hashValue; }
        const serialized = JSON.stringify(this); 
        let hashValue = 5381;
        for (let i = 0; i < serialized.length; i++) {
            hashValue = (hashValue * 33) ^ serialized.charCodeAt(i);
        }
        this.hashValue = (hashValue >>> 0).toString(16).padStart(8, "0");
        return this.hashValue;        
    }

    boxWidth(): number 
    {
        if (this.width) { return this.width; }
        if (this.sqBox) { return CONFIG.baseWidth * 1.5; }
        return CONFIG.baseWidth;
    }

    render(b: biSeq, realPos: number, bounce:bounceInfo): string {
        let eDateString: string = '';
        if (this.endDate) {
            eDateString = `<div class="endDate">${this.endDate.toString()}</div>`;
        }
        let stype: string = 'standard';
        // Render the associated box HTML if one exists inside this Square
        let boxHtml: string = '';
        if (this.sqBox) {
            boxHtml =  this.sqBox.render();
            stype = this.sqBox.boxType;
        }
        let p : string = '';
        if (this.palette) {  p = `data-theme="${this.palette}"` }

        return `<div hash="${this.hash}" class="historySquare" stype="${stype}"  style="order:${b.seq};--sWidth:${this.boxWidth()};--bounce:${bounce.base};--boxBounce:${bounce.box ?? 0}" 
                    data-dir="${b.dir}" data-pos="${realPos}" data-width="${this.boxWidth()}"  ${p} >
            <div class="startDate">${this.startDate.toString()}</div>
            ${eDateString}
            <div class="eText">${this.text.eText ?? ''}</div>
            <div class="jText">${this.text.jText ?? ''}</div>
            ${boxHtml}
        </div>`;
    }
}
export type Squares = Square[];
export type hrData = RawSquareData[] | string;


export class HistoryRoad {
    get bounce() { return  CONFIG.baseBounce; };
    public bounces : Bounces = {};
    public brushes : brushSet = [`<linearGradient id="brush1" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="var(--brush1-0)" />
    <stop offset="50%" stop-color="var(--brush1-50)" />
    <stop offset="100%" stop-color="var(--brush1-100)" />
</linearGradient>`,`
<linearGradient id="brush2" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="var(--brush2-0)" />
    <stop offset="60%" stop-color="var(--brush2-60)" />
    <stop offset="100%" stop-color="var(--brush2-100)" />
</linearGradient>`];
    public drainTop: number = CONFIG.drainTop;

    private drainRate(): number
    {
        if (CONFIG.hLineType == 'straight') { 
            return 0; 
        } 
        return (1 - (2* CONFIG.drainTop)) / CONFIG.pathWidth;
    }

    private rowCount(): number { 
            return CONFIG.rowItemCount * CONFIG.baseWidth;
    }

    private safeNumber(val: any): number {
       const num = Number(val);
        return isNaN(num) ? 1 : num;   // or throw, or use 0 — your choice
    }
    private sanitizeBounces(input: any): Bounces
    {
        if (typeof input !== 'object' || input === null) {
         return {};
        }

    const result: Bounces = {};

    for (const [key, value] of Object.entries(input)) {
          if (!value || typeof value !== 'object') continue;

        const base = this.safeNumber((value as any).base);
        const box = (value as any).box !== undefined 
            ? this.safeNumber((value as any).box) 
            : undefined;

        result[key] = { base: base, box: box };
    }

    return result;
    }

    private sanitizeConfig(input: any): ConfigData
    {
        const sFields : string[] = ['hLineType','palette'];
        const result: any = {};
        for (const [key, value] of Object.entries(input)) {
            if (sFields.includes(key)) {
                result[key] = value;
            } else {
                result[key] = Number(value);
            }
        }
        return result as ConfigData;
    }

    constructor(public squares: Squares, config: ConfigData) {
        if (config.settings) {
            Object.assign(CONFIG, this.sanitizeConfig(config.settings));
        }
        if (config.bounces) { this.bounces = this.sanitizeBounces(config.bounces); }
        document.body.dataset.theme = CONFIG.palette;

    }

    static fromJSON(inJSON: RawSquareData[], config: ConfigData): HistoryRoad 
    {
         const squares = inJSON.map(({ startDate, endDate, text, box, hash, width, palette }) => 
        new Square(
            Temporal.PlainDate.from(startDate),
            endDate ? Temporal.PlainDate.from(endDate) : null,
            text,
            box ?? null,
            hash ?? null,
            width ?? undefined,
            palette ?? undefined
        )
    );
        return new HistoryRoad(squares, config);       
    }

    static fromJsonString(jsonString: string, config: ConfigData): HistoryRoad {
        const rawData = JSON.parse(jsonString) as RawSquareData[];
        return this.fromJSON(rawData,config);
    }

    computePos(n:number): Position
    {
        return { row: Math.floor((n - 1) / this.rowCount()), 
                  col: (n - 1) % this.rowCount()};
    }

   TransposePos(n: number): biSeq {
        const pos = this.computePos(n);
        const dir : 'L' | 'R' = (pos.row % 2 === 1) ? 'L' : 'R'; 
        const snakeCol = (dir === 'L') ? (this.rowCount() - 1 - pos.col) : pos.col;
        return { seq: (pos.row * this.rowCount()) + snakeCol + 1 , dir };  
    }

    addBlank(renderBOX: HTMLElement,n: number)
    {
        renderBOX.insertAdjacentHTML('beforeend',`<div class="blankSquare" style="order:${this.TransposePos(n).seq}">&nbsp;</div>`);
    }

    dropRowLine(start: Point, currentRect: DOMRect, nextRect: DOMRect, isMovingRight: boolean):string
    {
        const stroke: string =          
                `stroke="url(#brush1)"
                stroke-width="${CONFIG.pathWidth}" 
                stroke-linecap="round"`;
        let end: Point;
        let cy2 : number = 0;
        let bonusCurve: number =  50;

        //several possible cases exist:
        // 1. alligned on the left row drop
        // 2. alligned on the right row drop
        // 3. drop is further to the left
        // 4. drop is further to the right

        if ((isMovingRight) && (Math.abs(currentRect.right - nextRect.right) < 10)) {
            end = { x: nextRect.right, y: nextRect.top + (nextRect.height* this.drainTop) };
            const circleDir =  1;
            return `<path d="M ${start.x} ${start.y} A 0.5 2.2 0 0 ${circleDir} ${end.x} ${end.y}" 
                  fill="none" 
                  ${stroke}  /><!--- straight down right -->`;
        }
        if ((!isMovingRight) && (Math.abs(currentRect.left - nextRect.left) < 10)) {
            end = { x: nextRect.left, y: nextRect.top + (nextRect.height * this.drainTop) };
            const circleDir =  0;
            return `<path d="M ${start.x} ${start.y} A 0.5 2.2 0 0 ${circleDir} ${end.x} ${end.y}" 
                  fill="none" 
                  ${stroke} /><!-- straight down left -->`;
        }
        const goDir = isMovingRight ? 1 : -1;

        if ((nextRect.right < currentRect.right) && (goDir === 1)) {

                const end : Point = { 
                    x: nextRect.right, 
                    y: nextRect.top + (nextRect.height * this.drainTop) 
                };

                const cp1X = start.x + (bonusCurve * goDir);
                const cp1Y = start.y + (currentRect.height + 10) * goDir;

                const cp2X = end.x + (bonusCurve * goDir);
                const cp2Y = end.y;

                return `<path d="M ${start.x} ${start.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${end.x} ${end.y}" fill="none" ${stroke}  />
                <!---  isRight? ${isMovingRight}  goDir ${goDir}-->`;
        }

            if ((nextRect.right > currentRect.left) && (goDir === -1)) {

                const end : Point = { 
                    x: isMovingRight ? nextRect.right : nextRect.left, 
                    y: nextRect.top + (nextRect.height * this.drainTop) 
                };

                const cp1X = start.x + (bonusCurve * goDir);
                const cp1Y = start.y + (currentRect.height + 10) * goDir;

                const cp2X = end.x + (bonusCurve * goDir);
                const cp2Y = end.y;

                return `<path d="M ${start.x} ${start.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${end.x} ${end.y}" fill="none" ${stroke}  />
                <!---  isRight? ${isMovingRight}  goDir ${goDir}-->`;
        }
        
        end  = { x: nextRect.left + (nextRect.width * CONFIG.drainMid), y: nextRect.top };
        cy2 = end.y - bonusCurve; 
        const cx2 = end.x;

        const horizontalSweep = 120; // Adjust this number to make the exit loop wider or tighter
        const cx1 = start.x < nextRect.right ? start.x + horizontalSweep : start.x - horizontalSweep;
        const cy1 = start.y;

        return `<path d="M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}" 
                      fill="none" 
                      ${stroke} /><!-- final mode -->`;
    }
 
    rowLine( start: Point, drainHit: number, nextRect: DOMRect, isMovingRight: boolean): string 
    {
            let end: Point = { x: 0, y: nextRect.top + Math.floor(nextRect.height * drainHit) };
            if (isMovingRight) {
                // Normal Row: Connect right side of current to left side of next
                end.x = nextRect.left;
            } else {
                // Snaking Reversed Row: Connect left side of current to right side of next
                end.x  = nextRect.left + nextRect.width;
            }

            let bHeight : number = CONFIG.pathWidth ;
            let bVary : number =Math.floor(Math.random() * CONFIG.hBrushVary);
            if (isMovingRight) {  bHeight = bHeight * -1;     }

            const controlX = (start.x + end.x) / 2;
            const controlY = (start.y + end.y) / 2;

            return `
            <polygon points="${start.x },${start.y+ bHeight} ${start.x},${controlY - bHeight - bVary}  ${end.x},${end.y - bHeight -bVary}   
                             ${end.x },${end.y+bHeight} ${controlX},${controlY + bHeight + bVary}  ${start.x},${start.y + bHeight + bVary}" 
                        fill="url(#brush2)"  />`; 
    }

    offsetRect(element: HTMLElement): DOMRect {
        const x = element.offsetLeft;
        const y = element.offsetTop;
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        // 2. Instantiate and return a true native DOMRect object
        return new DOMRect(x, y, width, height);
    }

    buildLines(renderBOX: HTMLElement)
    {
        renderBOX.querySelector('#hr_SVG')?.remove();
        const cLines : string[] = [];
        const sortedElements = [...document.querySelectorAll('.historySquare')].sort((a, b) => {
            const elementA = a as HTMLElement;
            const elementB = b as HTMLElement;
            const posA = Number(elementA.dataset.pos || 0);
            const posB = Number(elementB.dataset.pos || 0);
            return posA - posB;
        });  

        let i: number = 0;
        let drain: number = this.drainTop;
        let curDir: Direction = 'R';
        while (i < sortedElements.length -1) 
        {
            const c = sortedElements[i] as HTMLElement;
            const currentRect = this.offsetRect(c);
            const nextRect = this.offsetRect(sortedElements[i + 1] as HTMLElement);
            const isMovingRight : boolean = (c.dataset.dir === 'R') ? true : false;
            const width = Number(c.dataset.width);
            if (c.dataset.dir === curDir) { 
                //continue when straight
                drain = drain + (this.drainRate() * width); 
            } 
            else { 
                //reverser when not straight
                drain = this.drainTop; curDir = c.dataset.dir as Direction;
             }
            let start : Point = {x: 0 , y:  currentRect.top + Math.floor(currentRect.height * drain) } 
            if (isMovingRight) {
            // If we were moving right, exit from the right side
                start.x = currentRect.right;
            } else {
            // If we were moving left (RTL row), exit from the left side
                start.x = currentRect.left;
            }
            
            if (nextRect.top  > currentRect.top + this.bounce) {
                cLines.push(this.dropRowLine(start,currentRect,nextRect,isMovingRight));
            } else {
                cLines.push(this.rowLine(start,drain + this.drainRate(),nextRect, isMovingRight));
            }
            i++;
        }
            renderBOX.insertAdjacentHTML('beforeend', '<svg id="hr_SVG"><defs>' + this.brushes.join('')  + '</defs>' + cLines.join('') + '</svg>' ) ;
            const svg = renderBOX.querySelector('SVG') as HTMLElement;
            if (svg) svg.style.height = renderBOX.clientHeight + 'px';
    }

    resolveBounce(index: number, hash: string): bounceInfo
    {
        //the hash path lets bounce info stay with the system regardless of index
        if (hash in this.bounces) {
                 if (!("box" in this.bounces[hash]))  {
                this.bounces[hash].box = Math.floor(Math.random() * this.bounce );
            }
            return this.bounces[hash];        
        }
        //index works but is tied to the sequence so rearranging / deleting items will mess it up
        if (index in this.bounces) { 
            if (!("box" in this.bounces[index]))  {
                this.bounces[index].box = Math.floor(Math.random() * this.bounce );
            }
            return this.bounces[index]; 
        }
        return  {'base':  Math.floor(Math.random() * this.bounce ), 'box':  Math.floor(Math.random() * this.bounce )}; 
    }

    
    render(renderBOX: HTMLElement): void {
        renderBOX.style.setProperty('--rowCount',this.rowCount().toString());
        let lastPos : number = 1;
        if (CONFIG.offsetStart > 0) {
            let offsetCount : number = CONFIG.offsetStart;
            while (offsetCount > 0) {
                this.addBlank(renderBOX, lastPos);
                lastPos++;
                offsetCount--;
            }
        }

        this.squares.forEach((sq, index) => {
             const endPosition : number  = lastPos + sq.boxWidth(); 
             const target = this.computePos(endPosition-1).row;
             while (this.computePos(lastPos).row < target) {
                this.addBlank(renderBOX,lastPos);
                lastPos++;
             }

             renderBOX.insertAdjacentHTML('beforeend', 
                sq.render(  this.TransposePos(lastPos),
                            index,
                            this.resolveBounce(index,sq.hash)
                            ));
            lastPos += sq.boxWidth();
        });
        while (lastPos != this.TransposePos(lastPos).seq) {
            lastPos = lastPos + 1;
            this.addBlank(renderBOX,lastPos);
        }

        this.buildLines(renderBOX);
        renderBOX.addEventListener('resize', ()=> { this.buildLines(renderBOX); });

        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addEventListener('change', (mql) => {
               this.buildLines(renderBOX);  
        });
  
    }
}