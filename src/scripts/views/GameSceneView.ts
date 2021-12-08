enum Styles {
    Color = '#FFF',
    Font = 'Arial'
}

enum Texts {
    Flags = '<- RefreshPosition ->',
    Exit = 'EXIT',
    Success = 'YOU WIN!',
    Failure = 'YOU LOOSE'
};

export class GameSceneView {
    private _scene: Phaser.Scene = null;
    private _style: {font: string, fill: string};
    private _txtFlags: Phaser.GameObjects.Text = null;
    private _txtStatus: Phaser.GameObjects.Text = null;
    private _btnExit: Phaser.GameObjects.Text = null;


    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this._style = {font: `28px ${Styles.Font}`, fill: Styles.Color};
        this._create();
    }

    private _create(): void {
        this._createTxtFlags();
        this._createTxtStatus();
        this._createBtnExit();
    }


    public render(data: {boatsCounter?: number, status?: boolean}) {
        if (typeof data.boatsCounter !== 'undefined') {
            this._txtFlags.text = Texts.Flags;
        }
    
        if (typeof data.status !== 'undefined') {
            this._txtStatus.text = data.status ? Texts.Success : Texts.Failure;
            this._txtStatus.visible = true;
        }
    }

    private buttonOnHover(e) { 

        e.setStyle({ fill: '#ff0'});
        
    }

    private _createTxtFlags(): void {
        this._txtFlags = this._scene.add.text(
            100,
            100,
            Texts.Flags,
            this._style
        ).setOrigin(0, 1)
        this._txtFlags.setInteractive();
        this._txtFlags.once('pointerdown', () => { this._scene.scene.start('Game'); })
        .on('pointerover', () => {this.buttonOnHover(this._txtFlags)})
        .on('pointerout', () => this._txtFlags.setStyle({ fill: '#fff'}))
        this._txtFlags.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    }

 
    private _createTxtStatus(): void {
        this._txtStatus = this._scene.add.text(
            this._scene.cameras.main.centerX,
            50,
            Texts.Success,
            this._style
        ).setOrigin(0.5, 1);
    
        this._txtStatus.visible = false;
    }

    private _createBtnExit(): void {
        this._btnExit = this._scene.add.text(
            this._scene.cameras.main.width - 100,
            100,
            Texts.Exit,
            this._style
        ).setOrigin(1);
    
        this._btnExit.setInteractive();
        this._btnExit.once('pointerdown', () => { this._scene.scene.start('Start'); })
        .on('pointerover', () => {this.buttonOnHover(this._btnExit)})
        .on('pointerout', () => this._btnExit.setStyle({ fill: '#fff'}))
        this._btnExit.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    }
}