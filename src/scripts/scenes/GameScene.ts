import { Board } from "../models/Board";
import { Field } from "../models/Field";
import { GameSceneView } from "../views/GameSceneView";
import  boardSettings  from '../sharedData';


const firstBoardX = 0;
const secondBoardX = (boardSettings.size * 80) + firstBoardX;

const firstBoardAtlas = 'spritesheet';
const secondBoardAtlas = 'spritesheet2';

export class GameScene extends Phaser.Scene {
    
    private _board: Board = null;
    private _secondBoard: Board = null
    private _view: GameSceneView = null;

    constructor() {
        super('Game');
        document.querySelector("canvas").oncontextmenu = e => e.preventDefault();
    }

    public create(): void {
      
        this._board = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, firstBoardX, secondBoardAtlas);
        this._secondBoard = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, secondBoardX, firstBoardAtlas);

        this._board.open();
        this._secondBoard.on('left-click', this._onFieldClickLeft, this);

        this._view = new GameSceneView(this);

    }

    private _onGameOver(status: boolean) {
        this._board.off('left-click', this._onFieldClickLeft, this);
        this._secondBoard.off('left-click', this._onFieldClickLeft, this);
        this._board.open();
        this._secondBoard.open()
        this._view.render({ status });
    }

    private _getAttack(): void {
        
        const atackPlace = this._board.getRandomField(boardSettings.size, boardSettings.size);
        
        if (atackPlace.opened && atackPlace.exploded == false || atackPlace.mined && atackPlace.exploded == false ) {

            if(atackPlace.mined) { 
                
                atackPlace.exploded = true;

                if (this._board.checkExplode() == boardSettings.boats) {
                    this._onGameOver(false);
                }
            } else { 
                 setTimeout(() => atackPlace.closeField(), 100); 
            }
        } else {
            this._getAttack();
        }
    }
    
    private _onFieldClickLeft(field: Field): void {
        if (field.closed) { 
            field.open(); 
            this._getAttack();
            if (field.mined) { 

                field.exploded = true;
                if (this._secondBoard.checkExplode() == boardSettings.boats) {
                    this._onGameOver(true);
                }
            } else if (field.empty) { 
                field.open();
            }


        }
    }


}