import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Injectable()
export class DialogService {
  private _ref: MatDialogRef<any> | null = null;

  constructor(private _dialog: MatDialog) {}

  open<T = any>(
    ref: TemplateRef<T>,
    force = true,
    opts: MatDialogConfig = { hasBackdrop: true, disableClose: true }
  ): MatDialogRef<T> | null {
    if (!force && this._ref) {
      return null;
    }
    if (this._ref) {
      this._ref.close(-1);
    }
    return (this._ref = this._dialog.open(ref, opts));
  }

  close(reason: any = -2): void {
    if (!this._ref) {
      return;
    }
    this._ref.close(reason);
  }
}
