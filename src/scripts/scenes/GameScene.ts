import { Board } from "../models/Board";
import { Field } from "../models/Field";
import { GameSceneView } from "../views/GameSceneView";
import  boardSettings  from '../sharedData';


const firstBoardX = 0;
const secondBoardX = (boardSettings.size * 80) + firstBoardX;

const firstBoardAtlas = 'spritesheet';
const secondBoardAtlas = 'spritesheet2';
const vsPlayerAtlas = 'spritesheet3';



export class GameScene extends Phaser.Scene {
    
    private _board: Board = null;
    private _secondBoard: Board = null
    private _view: GameSceneView = null;
    private _mainText: any;
    private _background: any;

    constructor() {
        super('Game');
        document.querySelector("canvas").oncontextmenu = e => e.preventDefault();
    }

    public create(): void {
        this.sound.stopAll();
        this.sound.play("battle");


        this._background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'gameBack');
        this._background.displayWidth = window.innerWidth;
        this._background.displayHeight = window.innerHeight;

       
        
        if(!boardSettings.vs) { 
        this._board = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, firstBoardX, secondBoardAtlas);
        this._secondBoard = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, secondBoardX, firstBoardAtlas);
        this._board.open();
        } else { 
            this._board = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, firstBoardX, vsPlayerAtlas);
            this._secondBoard = new Board(this, boardSettings.size, boardSettings.size, boardSettings.boats, secondBoardX, vsPlayerAtlas);
           
        }

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
       if(!boardSettings.vs){
        const atackPlace = this._board.getRandomField(boardSettings.size, boardSettings.size);
        
        if (atackPlace.opened && atackPlace.exploded == false || atackPlace.mined && atackPlace.exploded == false ) {

            if(atackPlace.mined) { 
                
                atackPlace.exploded = true;

                if (this._board.checkExplode() == boardSettings.boats) {
                    this._onGameOver(false);
                }
                this._getAttack();
            } else { 
                 setTimeout(() => atackPlace.closeField(), 100); 
            }
        } else {
            this._getAttack();
        }
        }
    }

    private _switchTurn():void { 

        if(boardSettings.vs && boardSettings.turn){
            this._board.on('left-click', this._onFieldClickLeft, this);
            this._secondBoard.off('left-click', this._onFieldClickLeft, this);
        } 

        if(boardSettings.vs && !boardSettings.turn){
            this._secondBoard.on('left-click', this._onFieldClickLeft, this);
            this._board.off('left-click', this._onFieldClickLeft, this);
        } 

        boardSettings.turn = !boardSettings.turn;
    }
    
    private _onFieldClickLeft(field: Field): void {
     

        if (field.closed) { 
            field.open(); 
            this.sound.play("miss");
           
            if (field.mined) { 
                this.sound.play("bullet");
                field.exploded = true;
                if (this._secondBoard.checkExplode() == boardSettings.boats) {
                    this._onGameOver(true);
                }
            } else if (field.empty) { 
                field.open();
                this._getAttack();
                this._switchTurn()
            } else if (!field.mined) {
                this._getAttack();
                this._switchTurn()
                
            }
        }
    }


}