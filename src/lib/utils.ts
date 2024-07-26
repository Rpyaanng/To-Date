import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"]

export function DateToDisplay(ISOString: string) {
  const newDate = new Date(ISOString)
  return months[newDate.getMonth()] + " " + newDate.getDate();
}


export function OffsetDate(date: Date, offset: number) {
  const newDateMillis: number = new Date(date).getTime();
  const offsetMillis = offset * 24 * 60 * 60 * 1000;
  return new Date(newDateMillis + offsetMillis);

}

export function generateUniqueID() {
  const id = String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');
  return id;
}
