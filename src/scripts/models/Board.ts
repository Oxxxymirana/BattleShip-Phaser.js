import { Field } from "./Field";

export class Board extends Phaser.Events.EventEmitter {
    private _scene: Phaser.Scene = null;
    private _rows: number = 0;
    private _cols: number = 0;
    private _boats: number = 0;


    private secondBoardX: number = 0;
    private _fields: Field[] = [];

    private atlas: string = '';

    constructor(scene: Phaser.Scene, rows: number, cols: number, boats: number, secondBoardX: number, atlas: string) {
        super();
        this._scene = scene;
        this._rows = rows;
        this._cols = cols;
        this._boats = boats;
        this._fields = [];
        this.secondBoardX = secondBoardX;
        this.atlas = atlas;
        this._create();
    }

    public get cols(): number {
        return this._cols;
    }

    public get rows(): number {
        return this._rows;
    }

    public getField(row: number, col: number): Field {
        return this._fields.find(field => field.row === row && field.col === col);
    }

    public getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    public getRandomField(col:number, row:number): Field { 
        const randomCol = this.getRandomInt(col);
        const randomRow = this.getRandomInt(row)
        return this._fields.find(field => field.row == randomRow && field.col == randomCol);
    }

    public open(): void {
        this._fields.forEach(field => field.open());
    }

  

    public checkExplode(): number {
        let result = 0;
       
        this._fields.forEach(field => {
            result += +field.checkExploded();
        })
        
        return result;
     }

    public openUserBoard() : void { 
        this._fields.forEach(field => { 
            console.log(field.closed);
        })
    }

    public openClosestFields(field: Field): void {
        field.getClosestFields().forEach(item => {
            if (item.closed) {
                item.open();
    
                if (item.empty) {
                    this.openClosestFields(item);
                }
            }
        });
    }

    private _create(): void {
        this._createFields();
        this._createBombs();
        this._createValues(); 
    }

    private _onFieldClick(field: Field, pointer: Phaser.Input.Pointer): void {
        if (pointer.leftButtonDown()) {
            this.emit(`left-click`, field);
        } else if (pointer.rightButtonDown()) {
            this.emit(`right-click`, field);
        }
    }

    private _createFields(): void {
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                const field = new Field(this._scene, this, row, col, this.secondBoardX, this.atlas)
                field.view.on('pointerdown', this._onFieldClick.bind(this, field));
                this._fields.push(field);
            }
        }
    }

    private _createBombs(): void {
        let count = this._boats; 
    
        while (count > 0) { 
            let field = this._fields[Phaser.Math.Between(0, this._fields.length - 1)]; 
    
            if (field.empty) { 
                field.setBoat(); 
                --count; 
            }
        }
    }

    private _createValues() {
    
        this._fields.forEach(field => {
            if (field.mined) {
                field.getClosestFields().forEach(item => {
                    if (item.value >= 0) {
                        ++item.value;
                    }
                });
            }
        });
    }
}