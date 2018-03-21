// Libs
import { OrientationType } from '@seed/enums';
import { State } from '@seed/interfaces';
import isNil from 'lodash/isNil';
// Lodash
import isNumber from 'lodash/isNumber';

export class LayoutState extends State {
	static readonly STORE_NAME = 'layout';

	isFullScreen: boolean;

	private _width: number;
	get width(): number {
		return this._width;
	}
	set width(width: number) {
		if (!isNumber(width)) {
			return;
		}
		this._width = width;
		this._setOrientation();
	}
	private _height: number;
	get height(): number {
		return this._height;
	}
	set height(height: number) {
		if (!isNumber(height)) {
			return;
		}
		this._height = height;
		this._setOrientation();
	}
	get viewport(): { width: number; height: number } {
		return { width: this._width, height: this._height };
	}
	set viewport(val: { width: number; height: number }) {
		if (isNil(val) || !isNumber(val.width) || !isNumber(val.height)) {
			return;
		}
		this._width = val.width;
		this._height = val.height;
		this._setOrientation();
	}
	private _orientation: OrientationType;
	get orientation(): OrientationType {
		return this._orientation;
	}
	set orientation(val: OrientationType) {
		throw Error('Trying to set Orientation: ' + val);
	}
	pixelDensity?: number;
	backgroundColor?: string;

	private _setOrientation() {
		this._orientation =
			this.width > this.height
				? OrientationType.LANDSCAPE
				: OrientationType.PORTRAIT;
	}
}
