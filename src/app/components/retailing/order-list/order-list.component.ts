import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TdDialogService, TdLoadingService, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder,
    ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableRowClickEvent
} from '@covalent/core';
import { OrderService, IOrder } from '../../../services';
import { BaseComponent, PageHeader, Status } from '../../../core';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: './order-list.component.html',
    styleUrls: ['order-list.component.css']
})
export class OrderListComponent extends BaseComponent implements OnInit {

    header: PageHeader = new PageHeader("Orders", ["Retailing", "Orders"]);

    data: IOrder[] = [];

    columns: ITdDataTableColumn[] = [
        { name: 'sn', label: 'SN', filter: true },
        { name: 'statusdesc', label: 'Status', filter: true },
        { name: 'date', label: 'Date', filter: true },
        { name: 'remark', label: 'Remark', filter: true },
        { name: 'id', label: '', filter: false }
    ];

    clickable: boolean = true;
    selectable: boolean = false;
    filteredData: any[] = this.data;
    filteredTotal: number = this.data.length;
    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 5;
    sortBy: string = 'sn';
    selectedRows: any[] = [];
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private order: OrderService, private dataTable: TdDataTableService,
        protected route: ActivatedRoute, protected router: Router, protected loading: TdLoadingService, protected dialog: TdDialogService) {
        super(route, router, loading, dialog)
    }

    ngOnInit(): void {
        this.filter();
    }

    async filter(): Promise<void> {
        this.load();

        try {
            this.data = await this.order.all().toPromise()
        }
        catch (error) {
            this.data = [];
            this.handleError(error)
        }
        finally {
            this.unload()

            let newData: IOrder[] = this.data;

            let excludedColumns: string[] = this.columns
                .filter((column: ITdDataTableColumn) => {
                    return ((column.filter === undefined && column.hidden === true) || (column.filter !== undefined && column.filter === false));
                }).map((column: ITdDataTableColumn) => {
                    return column.name;
                });

            newData = this.dataTable.filterData(newData, this.searchTerm, true, excludedColumns);
            this.filteredTotal = newData.length;
            newData = this.dataTable.sortData(newData, this.sortBy, this.sortOrder);
            newData = this.dataTable.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
            this.filteredData = newData;
        }
    }

    async add(): Promise<any> {
        try {
            let order = { cid: null, remark: "N/A" }

            let result = await this.order.add(order).toPromise()

            if (result.status == Status.Success) {
                this.navigate(`/central/order/edit/${result.details.oid}`)
            }
            else {
                this.alert(result.message)
            }
        }
        catch (error) {
            this.handleError(error)
        }
        finally {
            this.unload()
        }
    }

    edit(id: string): void {
        this.navigate(`/central/order/edit/${id}`)
    }

    sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
    }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    page(pagingEvent: IPageChangeEvent): void {
        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    delete(id: string): void {

        this.confirm("Are you confirm to delete this record?", (accepted) => {
            if (accepted) {
                this.handleDelete(id)
            }
        })
    }

    async handleDelete(id: string): Promise<void> {
        try {
            let result = await this.order.remove(id).toPromise()
            this.alert(result.message)
            this.filter();
        }
        catch (error) {
            this.handleError(error)
        }
        finally {
            this.unload()
        }
    }
}