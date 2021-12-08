import { Board } from "./Board";
import { FieldView } from "../views/FieldView";

const Positions = [
    {row : 0, col : 1}, 
    {row : 0, col : -1},
    {row : 1, col : 0},
    {row : 1, col : 1},
    {row : 1, col : -1}, 
    {row : -1, col : 0}, 
    {row : -1, col : 1},
    {row : -1, col : -1} 
];

enum States {
    Closed = 'closed',
    Opened = 'opened',
   
};

export class Field extends Phaser.Events.EventEmitter {

    private _state: string = States.Closed;

    private _scene: Phaser.Scene = null;
    private _board: Board = null;
 
    private _row: number = 0;
    private _col: number = 0;

    private _view: FieldView = null;
 
    private _value: number = 0;
    private _exploded: boolean = false;
    private secondBoardX: any = 0;
    private atlas: string = '';

    constructor(scene: Phaser.Scene, board: Board, row: number, col: number, secondBoardX : any, atlas : string) {
        super();
        this._init(scene, board, row, col, secondBoardX, atlas);
    }

    public set exploded(exploded: boolean) {
        this._exploded = exploded;
        this.emit('change');
    }

    public get exploded(): boolean {
        return this._exploded;
    }

    public get closed(): boolean {
        return this._state === States.Closed;
    }

    public get opened(): boolean {
        return this._state === States.Opened;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value) {
        this._value = value;
    }

 
    public get empty(): boolean {
        return this._value === 0;
    }


    public get mined(): boolean {
        return this._value === -1;
    }


    public get filled(): boolean {
        return this._value > 0;
    }

  
    public setBoat(): void {
        this._value = -1;
    }

  
    public get view(): FieldView {
        return this._view;
    }

    public get col(): number {
        return this._col;
    }


    public get row(): number {
        return this._row;
    }


    public get board(): Board {
        return this._board;
    }


    public open(): void {
        this._setState(States.Opened);
    }

    public checkExploded(): boolean { 
        return this._exploded;
    }

    private _setState(state: string): void {
        if (this._state !== state) {
            this._state = state;
            this.emit('change');
        }
    }

    public closeField(): void{ 
     
        this._setState(States.Closed);
        this.emit('change');
        console.log(this);
    }

    
    public getClosestFields(): Field[] {
        let results = [];
    
      
        Positions.forEach(position => {

            let field = this._board.getField(this._row + position.row, this._col + position.col);
            if (field) {
                results.push(field);
            }
        });
    
        return results;
    };

    private _init(scene: Phaser.Scene, board: Board, row: number, col: number, secondBoardX:number, atlas: string): void {
        this._scene = scene;
        this._board = board;
        this._row = row;
        this._col = col;
        this.secondBoardX = secondBoardX;
        this.atlas = atlas;
        this._view = new FieldView(this._scene, this, this.secondBoardX, this.atlas);
    }
}