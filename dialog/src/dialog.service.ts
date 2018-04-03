import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Injectable()
export class DialogService {
  private _ref: MatDialogRef<any>;

  constructor(private _dialog: MatDialog) {}

  open<T = any>(
    ref: TemplateRef<T>,
    force = true,
    opts: MatDialogConfig = { hasBackdrop: true, disableClose: true }
  ): MatDialogRef<T> | boolean {
    if (!force && this._ref !== undefined) {
      return false;
    }
    if (this._ref) {
      this._ref.close(-1);
    }
    this._ref = this._dialog.open(ref, opts);
    return;
  }

  close(reason: any = -2): void {
    if (this._ref === undefined) {
      return;
    }
    this._ref.close(reason);
  }
}
