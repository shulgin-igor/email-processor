import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-group',
  templateUrl: './address-group.component.html',
  styleUrls: ['./address-group.component.scss'],
})
export class AddressGroupComponent implements OnInit {
  @Input() name: string;
  @Input() list: any[];

  constructor() {}

  ngOnInit(): void {}

  // TODO: bubble up
  handleUserCreate(user: any, item: any) {
    item.user = user;
  }
}
