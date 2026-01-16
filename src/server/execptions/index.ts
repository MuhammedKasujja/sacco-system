export class MemberNotFoundException extends Error {
  constructor() {
    super()
    this.message = 'Member details Not found'
  }
}

export class AccountNotFoundException extends Error {
  constructor() {
    super()
    this.message = 'Account details Not found'
  }
}
