import { useState, KeyboardEvent, ChangeEvent } from "react";
import { TextField } from "@mui/material";

export const Input = (props: {
  handleInput?: (params: string) => any;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && props.handleInput) {
      setInput("");
      await props.handleInput(input);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={props.placeholder}
      value={input}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};
