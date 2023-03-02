interface Env {
  CLIENT_ID: string
  CLIENT_SECRET: string
  GITHUB_TOKEN: string
  IP_WHITELIST: string
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (request.headers.get("CF-Connecting-IP") !== env.IP_WHITELIST) {
    return new Response('인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요.')
  }

  const url = new URL(request.url)

  const { token_type, access_token } = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'GBSWHS github-registrar (https://github.com/GBSWHS/github-registrar)'
    },
    body: JSON.stringify({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code: url.searchParams.get('code')
    })
  }).then((res) => res.json() as any)

  const { id } = await fetch('https://api.github.com/user', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      Authorization: `${token_type} ${access_token}`,
      'User-Agent': 'GBSWHS github-registrar (https://github.com/GBSWHS/github-registrar)'
    }
  }).then((res) => res.json() as any)

  await fetch('https://api.github.com/orgs/GBSWHS/invitations', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'GBSWHS github-registrar (https://github.com/GBSWHS/github-registrar)'
    },
    body: JSON.stringify({
      invitee_id: id
    })
  })


  return Response.redirect('https://github.com/orgs/GBSWHS/invitation')
}
