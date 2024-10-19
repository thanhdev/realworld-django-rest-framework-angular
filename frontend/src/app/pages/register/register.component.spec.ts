import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { CommonModule } from "@angular/common";
import { UserService } from "../../common/services/api/user.service";
import { of } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule, Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let spyUserService: Partial<jasmine.SpyObj<UserService>>;
  let spyRouter: Partial<Router>;

  beforeEach(()=> {
    spyUserService = {
      registerUser: jasmine.createSpy('registerUser')
    }
    spyUserService.registerUser!.and.returnValue(of(null as any));

    spyRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    }
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RegisterComponent
      ],
      providers: [
        { provide: UserService, useValue: spyUserService },
        { provide: Router, useValue: spyRouter }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .overrideComponent(RegisterComponent, {
        remove: {
          imports: [RouterModule]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use form values to create new user', ()=> {
    const expectedUser = {
      email: 'a@hotmail.com',
      username: 'a',
      password: 'thisIsPassword'
    }
    component.mainForm.patchValue({
      email: expectedUser.email,
      username: expectedUser.username,
      password: expectedUser.password
    })

    component.registerUser();

    expect(spyUserService.registerUser).toHaveBeenCalledWith({user: expectedUser});
  });
});
