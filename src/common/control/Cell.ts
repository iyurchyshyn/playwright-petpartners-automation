export interface ICellOptions {
    position?: number;
    typeCell?: string;
    nameCell?: string;
}

export class Cell {
    private _position: number;
    private _typeCell: string;
    private _nameCell: string;

    constructor(options: ICellOptions = {}) {
        this._position = options.position ?? 0;
        this._typeCell = options.typeCell ?? '';
        this._nameCell = options.nameCell ?? '';
    }

    // Getters
    get position(): number {
        return this._position;
    }

    get typeCell(): string {
        return this._typeCell;
    }

    get nameCell(): string {
        return this._nameCell;
    }

    // Setters
    set position(value: number) {
        this._position = value;
    }

    set typeCell(value: string) {
        this._typeCell = value;
    }

    set nameCell(value: string) {
        this._nameCell = value;
    }

    public toJSON(): ICellOptions {
        return {
            position: this._position,
            typeCell: this._typeCell,
            nameCell: this._nameCell
        };
    }

    public toString(): string {
        return `Cell(position: ${this._position}, type: ${this._typeCell}, name: ${this._nameCell})`;
    }
}