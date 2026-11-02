function PageHeader({
  eyebrow,
  title,
  description,
  actions
}) {
  return (
    <div className="page-header">
      <div className="page-heading">
        {eyebrow && (
          <span className="page-eyebrow">
            {eyebrow}
          </span>
        )}

        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {actions && (
        <div className="page-header-actions">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;