let __exist = false;

/**
 * Since too many feedback using static method like `Modal.confirm` not getting theme, we record the
 * theme register info here to help developer get warning info.
 */
export default function existThemeConfig(exist?: boolean): boolean {
  if (typeof exist === 'boolean') {
    __exist = exist;
  }
  return __exist;
}
