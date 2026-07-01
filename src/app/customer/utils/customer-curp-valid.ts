export function validCurp(input: string, extCurp: boolean): boolean {
  if(input.length === 18 && !extCurp){
    return true;
  }else if(input.length === 0 && extCurp){
    return true;
  }else{
    return false;
  }
}

export function countSpaces(str: string): number {
  const spaces = (str.match(/ /g) || []).length;

  if (spaces === 0) {
    return 1;
  } else if (spaces === 1) {
    return 2;
  } else {
    return 3;
  }
}