"use client";

import Input from "./input";

export default function Forms(props) {
  return (
    <>
      <Input
        type="email"
        onChange={props.onChangeEmail}
        placeholder={props.placeholderEmail}
      />
      <Input
        type="password"
        onChange={props.onChangePassword}
        placeholder={props.placeholderPassword}
      />
    </>
  );
}
