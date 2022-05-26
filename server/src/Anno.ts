//파싱 에노테이션 입니다.
function stringToJson(target: any, key: string, desc: PropertyDescriptor): any {
  const originCode = desc.value;
  desc.value = function (...args: any[]) {
    if (args && args[0]) {
      let data: any = JSON.parse(args[0].toString());
      args[0] = data;
    }
    return originCode.apply(this, args);
  };
  return desc;
}

export { stringToJson };
