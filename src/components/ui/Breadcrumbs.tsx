import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  id?: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

export default function Breadcrumbs({ items = [] }: Props) {
  return (
    <div className="breadcrumbs">
      <ul>
        {items.map(({ label, to, id }) => (
          <li key={id ?? label}>
            {to ? <Link to={to}>{label}</Link> : label}
          </li>
        ))}
      </ul>
    </div>
  );
}