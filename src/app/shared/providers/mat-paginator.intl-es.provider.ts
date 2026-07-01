import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class MatPaginatorIntlEs extends MatPaginatorIntl {
    override itemsPerPageLabel: string = 'Items por página';
    override nextPageLabel: string = '';
    override previousPageLabel: string = '';
    override lastPageLabel: string = '';
    override firstPageLabel: string = '';
}