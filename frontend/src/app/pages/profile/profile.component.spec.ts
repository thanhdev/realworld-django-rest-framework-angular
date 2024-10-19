import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from "@angular/router";
import { FeedMenuEnum } from "../../common/models/view/feed.view-model";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { ProfileService } from "../../common/services/api/profile.service";
import { of } from "rxjs";
import { UserProfile } from "../../common/models/api/profile.model";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ArticlesFeedComponent } from '../article/feed/articles-feed.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  let mockUserProfile: UserProfile;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let spyProfileService: Partial<jasmine.SpyObj<ProfileService>>;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          username: 'test'
        },
        data: {
          feedMenu: FeedMenuEnum.FAVORITES
        }
      } as unknown as ActivatedRouteSnapshot
    }

    mockUserProfile = {
      username: 'test',
      bio: 'test',
      image: 'test',
      following: false
    }

    spyProfileService = {
      getProfile: jasmine.createSpy('getProfile'),
      followUser: jasmine.createSpy('followUser'),
      unfollowUser: jasmine.createSpy('unfollowUser')
    }

    spyProfileService.getProfile!.and.returnValue(of({profile: mockUserProfile}));
    spyProfileService.followUser!.and.returnValue(of({profile: mockUserProfile}));
    spyProfileService.unfollowUser!.and.returnValue(of({profile: mockUserProfile}));
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
        ProfileComponent
      ],
      providers: [
        Router,
        AuthenticationService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProfileService, useValue: spyProfileService }
      ]
    })
      .overrideComponent(ProfileComponent, {
        remove: {
          imports: [RouterModule, ArticlesFeedComponent]
        },
        add: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile', () => {
    expect(spyProfileService.getProfile).toHaveBeenCalledWith(mockUserProfile.username);
    expect(component.profile()).toEqual(mockUserProfile);
  });

  it('should follow user', () => {
    component.follow();
    expect(spyProfileService.followUser).toHaveBeenCalledWith(mockUserProfile.username);
    expect(component.profile()).toEqual(mockUserProfile);
  });

  it('should unfollow user', () => {
    component.unfollow();
    expect(spyProfileService.unfollowUser).toHaveBeenCalledWith(mockUserProfile.username);
    expect(component.profile()).toEqual(mockUserProfile);
  });
});
