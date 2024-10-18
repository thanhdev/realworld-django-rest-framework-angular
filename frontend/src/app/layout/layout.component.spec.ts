import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RequestHelperService } from '../common/services/utils/request-helper.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;
  let mockActivatedRoute: Partial<jasmine.SpyObj<ActivatedRoute>>;

  beforeEach(()=> {
    spyRequestHelperService = {
      get: jasmine.createSpy('get')
    }
    spyRequestHelperService.get!.and.returnValue(of(null));

    mockActivatedRoute = {}
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent
      ],
      providers: [
        { provide: RequestHelperService, useValue: spyRequestHelperService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
