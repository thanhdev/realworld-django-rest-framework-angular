import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { UserSettingsComponent } from "./pages/user-settings/user-settings.component";
import { EditorComponent } from "./pages/editor/editor.component";
import { ArticleComponent } from "./pages/article/article.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { FeedMenuEnum } from "./common/models/view/feed.view-model";
import { ProfileRoutingData } from "./common/models/view/profile-routing-data.model";
import { authenticationGuard } from "./common/guards/authentication.guard";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: UserSettingsComponent, canActivate: [authenticationGuard] },
  {
    path: 'editor',
    canActivateChild: [authenticationGuard],
    children: [
    { path: '', component: EditorComponent },
    { path: ':slug', component: EditorComponent }
    ]
  },
  { path: 'article/:slug', component: ArticleComponent },
  {
    path: 'profile/:username', children: [
      {
        path: '',
        component: ProfileComponent,
        data: { feedMenu: FeedMenuEnum.MINE } as ProfileRoutingData
      },
      {
        path: 'favorites',
        component: ProfileComponent,
        data: { feedMenu: FeedMenuEnum.FAVORITES } as ProfileRoutingData
      }
    ]
  },
  {
    path: 'my-profile',
    canActivate: [authenticationGuard],
    children: [
      {
        path: '', component: ProfileComponent,
        data: { feedMenu: FeedMenuEnum.MINE } as ProfileRoutingData
      },
      {
        path: 'favorites', component: ProfileComponent,
        data: { feedMenu: FeedMenuEnum.FAVORITES } as ProfileRoutingData
      }
    ],

  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
