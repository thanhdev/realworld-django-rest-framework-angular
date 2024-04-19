import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "../../common/services/api/user.service";
import { of } from "rxjs";
import { User } from "../../common/models/api/user.model";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let currentUser: User;
  let spyUserService: Partial<jasmine.SpyObj<UserService>>;
  let spyAuthenticationService: Partial<jasmine.SpyObj<AuthenticationService>>;

  beforeEach(()=> {
    currentUser = {
      token: '1',
      username: 'test',
      email: 'test@abc.com'
    };

    spyUserService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser')
    };
    spyUserService.getCurrentUser!.and.returnValue(of({user: currentUser}));

    spyAuthenticationService = {
      currentUser$: of(currentUser),
      currentUserToken: currentUser.token
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: AuthenticationService, useValue: spyAuthenticationService},
        {provide: UserService, useValue: spyUserService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user', () => {
    expect(spyUserService.getCurrentUser).toHaveBeenCalledTimes(1);
  });
});
