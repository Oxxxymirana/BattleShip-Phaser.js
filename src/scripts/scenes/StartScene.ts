import  boardSettings  from '../sharedData';

const spritesheetPng = require("./../../assets/spritesheet.png");
const openSpritesheetPng = require("./../../assets/spritesheet2.png");
const spritesheetJson = require("./../../assets/spritesheet.json");
const backgroundJpg = require("../../assets/background.jpg")
const gameBackJpg = require('../../assets/gameback.jpg')

enum Texts {
    Title = 'Warships Battle',
    Message = 'Test task for Free Play',
    LitleBoard = 'Start game ( Small board : 4x4 / 5 boats)',
    Board = 'Start game ( Standart board : 6x6 / 9 boats)',
    BigBoard = 'Start game ( Big board : 8x8 / 15 boats)',
}

enum Styles {
    Color = '#FFF',
    Font = 'Arial'
}


/**
 * @export
 * @class StartScene
 * @extends {Phaser.Scene}
 * 
 */

  
export class StartScene extends Phaser.Scene {
    constructor() {
        super('Start');
    }
    
    private _background: any;
    private _mainText: any;
    private _titleText: any;
    private _clickButton: any;
    private _clickMidleButton: any;
    private _clickBigButton: any;

    public preload(): void {
        this.load.atlas('spritesheet2', openSpritesheetPng, spritesheetJson);
        this.load.atlas("spritesheet", spritesheetPng, spritesheetJson);
        
        this.load.image('background', backgroundJpg);
        this.load.image('gameBack', gameBackJpg);
        
        this.load.audio('battle', '../../src/assets/battle.mp3');
        this.load.audio('main', '../../src/assets/epic.mp3');
        this.load.audio('play', '../../src/assets/play.mp3');
        this.load.audio('bullet', '../../src/assets/bullet.mp3')
        this.load.audio('miss', '../../src/assets/miss.mp3')
    }

    private startGame(boartSize: number, boatsValue: number):void { 

        boardSettings.size = boartSize;
        boardSettings.boats = boatsValue;

        this.sound.stopAll();
        this.scene.start('Game');
    }

    private buttonOnHover(e) { 

        e.setStyle({ fill: '#ff0'});
        this.sound.play('play')
    }

    public create(): void {
        this.sound.stopAll();
        this.sound.play('main');

        this._background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'background');
        this._background.displayWidth = window.innerWidth;
        this._background.displayHeight = window.innerHeight;

        this._mainText = this.add.text(
            window.innerWidth/8,  
            window.innerHeight/10,
            Texts.Title, 
            {font: `48px ${Styles.Font}`, fill: Styles.Color})
        .setOrigin(0.5);
    
        this._titleText = this.add.text(
            window.innerWidth/8 + 80,
            window.innerHeight/10 + 50,
            Texts.Message,
            {font: `18px ${Styles.Font}`, fill: Styles.Color})
        .setOrigin(0.5);

        this._clickButton = this.add.text( 
            50, window.innerHeight/2 + 160,
            Texts.LitleBoard,
            {font : 'bold 32px Arial', Fill: '#999'})
        .setInteractive()
        .on('pointerdown', () => {this.startGame(4,5);})
        .on('pointerover', () => {this.buttonOnHover(this._clickButton)})
        .on('pointerout', () => this._clickButton.setStyle({ fill: '#fff'}))

        this._clickMidleButton = this.add.text( 
            50, window.innerHeight/2 + 210,
            Texts.Board,
            {font : 'bold 32px Arial', Fill: '#999'})
        .setInteractive()
        .on('pointerdown', () => {this.startGame(6,9)})
        .on('pointerover', () => {this.buttonOnHover(this._clickMidleButton)})
        .on('pointerout', () => this._clickMidleButton.setStyle({ fill: '#fff'}))

        this._clickBigButton = this.add.text( 
            50, window.innerHeight/2 + 260,
            Texts.BigBoard,
            {font : 'bold 32px Arial', Fill: '#999'})
        .setInteractive()
        .on('pointerdown', () => {this.startGame(8,15);})
        .on('pointerover', () => { this.buttonOnHover(this._clickBigButton)})
        .on('pointerout', () => this._clickBigButton.setStyle({ fill: '#fff'}))


        this._mainText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this._titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this._clickButton.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this._clickMidleButton.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this._clickBigButton.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    }
}