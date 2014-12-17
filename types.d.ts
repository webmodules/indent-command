/// <reference path='require.d.ts' />

declare module "block-elements" {
  var blockElements: string[];
  export = blockElements;
}

declare module "component-closest" {
  function closest(element: Node, selector: string, checkYoSelf?: boolean, root?: HTMLElement): HTMLElement;
  export = closest;
}

declare module "component-query" {
  function query(selector: string, context: HTMLElement): HTMLElement;
  module query {
    export function all(selector: string, context: HTMLElement): HTMLElement[];
  }
  export = query;
}

declare module "debug" {
  function debug(namespace: string): (format: string, ...args: any[]) => void;
  export = debug;
}

declare module "dom-iterator" {
  class Iterator {
    constructor(node: Node, root?: Node);
    public reset(node?: Node): Iterator;
    public revisit(revisit?: boolean): Iterator;
    public opening(): Iterator;
    public atOpening(): Iterator;
    public closing(): Iterator;
    public atClosing(): Iterator;
    public next(type?: number, n?: number): Node;
    public prev(type?: number, n?: number): Node;
    public previous(type?: number, n?: number): Node;
    public select(expr: number): Iterator;
    public select(expr: string): Iterator;
    public select(expr: (node: Node) => boolean): Iterator;
    public selects(node: Node, peek: boolean): boolean;
    public reject(expr: number): Iterator;
    public reject(expr: string): Iterator;
    public reject(expr: (node: Node) => boolean): Iterator;
    public rejects(node: Node, peek: boolean): boolean;
    public higher(node: Node): boolean;
    public compile(expr: any): (node?: Node) => boolean;
    public peak(expr?: any, n?: number): Node;
    public peek(expr?: any, n?: number): Node;
    public use(fn: (iterator: Iterator) => void ): Iterator;
  }
  export = Iterator;
}

declare module "frozen-range" {
  class FrozenRange {
    // XXX: these 4 properties aren't technically "public", but indent-command
    // modifies these properties in some cases so we have to lie here
    public startPath;
    public startOffset;
    public endPath;
    public endOffset;

    constructor(range: Range, reference: Node);
    public thaw(reference: Node, range?: Range): Range;
  }
  export = FrozenRange;
}

declare module "node-contains" {
  function contains(node: Node, other: Node): boolean;
  export = contains;
}
