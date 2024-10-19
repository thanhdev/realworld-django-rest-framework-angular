import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { UserService } from "../../common/services/api/user.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginUserPayload, User } from "../../common/models/api/user.model";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockUser: User;
  let spyUserService: Partial<jasmine.SpyObj<UserService>>;
  let spyRouter: Partial<jasmine.SpyObj<Router>>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(()=> {
    mockUser = {
      username: 'test',
      token: 'test',
      email: 'a@hotmail.com'
    };

    spyUserService = {
      userLogin: jasmine.createSpy('userLogin')
    }
    spyUserService.userLogin?.and.returnValue(of({user: mockUser}))

    spyRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    }

    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          returnUrl: '/'
        }
      } as any
    }
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        LoginComponent
      ],
      providers: [
        AuthenticationService,
        { provide: UserService, useValue: spyUserService },
        { provide: Router, useValue: spyRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .overrideComponent(LoginComponent, {
        remove: {
          imports: [RouterModule]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login user and navigate to home', ()=> {
    const expectedPayload: LoginUserPayload = {
      user: {
        email: 'a@hotmail.com',
        password: 'test'
      }
    }

    component.mainForm.patchValue({
      email: expectedPayload.user.email,
      password: expectedPayload.user.password
    })

    component.login();

    expect(spyUserService.userLogin).toHaveBeenCalledOnceWith(expectedPayload);
    expect(spyRouter.navigateByUrl).toHaveBeenCalledOnceWith('/');
  });
});
