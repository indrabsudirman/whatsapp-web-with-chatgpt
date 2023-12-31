const FormRow = ({
  type,
  name,
  labelText,
  defaultValue,
  minLength,
  maxLength,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        defaultValue={defaultValue || ""}
        minLength={minLength}
        maxLength={maxLength}
        required
      />
    </div>
  );
};

export default FormRow;
