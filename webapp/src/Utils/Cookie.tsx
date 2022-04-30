import Cookies from 'js-cookie'
import {useState, Dispatch, SetStateAction, } from "react";

export function useAndUpdateCookie<Type>(props: {
  cookieKey: string
}): [Array<Type>, Dispatch<SetStateAction<Array<Type>>>] {
  const rawData = Cookies.get(props.cookieKey);
  const savedData = rawData === undefined ? [] : JSON.parse(rawData);
  const [data, setData] = useState<Array<Type>>(savedData);
  Cookies.set(props.cookieKey, JSON.stringify(data), {expires: 365, sameSite: "strict"});
  return [data, setData];
}
