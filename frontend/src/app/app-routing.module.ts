import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { UserSettingsComponent } from "./pages/user-settings/user-settings.component";
import {EditorComponent} from "./pages/editor/editor.component";
import { ArticleComponent } from "./pages/article/article.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: UserSettingsComponent },
  { path: 'editor', children: [
    { path: '', component: EditorComponent },
    { path: ':slug', component: EditorComponent }
    ]
  },
  { path: 'article/:slug', component: ArticleComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
