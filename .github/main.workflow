workflow "Build on push" {
  on = "push"
  resolves = [
    "Publish",
    "Test",
  ]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "test --coverage"
  env = {
    CI = "1"
  }
}

action "Filter tag" {
  uses = "actions/bin/filter@46ffca7632504e61db2d4cb16be1e80f333cb859"
  needs = ["Test"]
  args = "tag v*"
}

action "Publish" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Filter tag"]
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
