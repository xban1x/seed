import { NgModule } from '@angular/core';
import { DialogService } from './dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [MatDialogModule],
  providers: [DialogService]
})
export class DialogModule {}
