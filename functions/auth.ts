interface Env {
  CLIENT_ID: string
}

export const onRequestGet: PagesFunction<Env> = ({ env }) =>
  Response.redirect('https://github.com/login/oauth/authorize?client_id=' + env.CLIENT_ID)
