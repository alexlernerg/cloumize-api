import { Service } from 'typedi'

@Service()
export class UserHelper {
  /**
   * It takes a name and surname, converts them to lowercase, trims them, takes the first letter of the
   * name and concatenates it with the surname, and returns the result
   * @param {string} name - string - the name of the user
   * @param {string} surname - string - this is the surname of the user.
   * @returns The first letter of the name and the surname.
   */
  createUsername (name: string, surname: string): string {
    return `${name.toLowerCase().trim().slice(0, 1)}${surname.toLowerCase().trim()}.`
  }

  /**
   * It returns a random string of characters
   * @returns A random string of characters.
   */
  createPassword (): string {
    return Math.random().toString(35).slice(2)
  }
}
