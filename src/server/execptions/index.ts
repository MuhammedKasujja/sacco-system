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
    this.name = AccountNotFoundException.name
  }
}

export class LoanScheduleNotFoundException extends Error {
  constructor() {
    super()
    this.message = 'Loan Schedule not found'
  }
}

export class LoanNotFoundException extends Error {
  constructor() {
    super()
    this.message = 'Loan not found'
  }
}
