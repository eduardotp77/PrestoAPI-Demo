import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../models/customer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrestoService } from '../services/presto.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Customer>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'FirstName',
    'LastName',
    'City',
    'Country',
    'Phone',
    'Buttons',
  ];

  constructor(private ps: PrestoService) {}

  ngOnInit() {
    this.getCustomers();
  }

  async getCustomers() {
    const suppliers = await this.ps.getCustomers();
    this.dataSource = new MatTableDataSource(suppliers || []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
  addRow() {
    this.dataSource.filter = '';
    this.dataSource.paginator.firstPage();
    //this.dataSource.data isn't directly mutable
    const arr = this.dataSource.data;
    arr.unshift(new Customer());
    this.dataSource.data = arr;
  }
  async save(o: Customer) {
    o.edit = false;
    if (o.Id) await this.ps.updateCustomer(o);
    else await this.ps.createCustomer(o);
    this.ngOnInit();
  }
  delete(o: Customer) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != o.Id);
    return this.ps.deleteCustomer(o);
  }
  cancel(o: Customer) {
    o.edit = false;
    this.ngOnInit();
  }
}