type GroupOption = 'none' | 'country' | 'company' | 'industry';

interface GroupSelectorProps {
  value: GroupOption;
  onChange: (value: GroupOption) => void;
}

export default function GroupSelector({ value, onChange }: GroupSelectorProps) {
  return (
    <div className="mb-4">
      <label htmlFor="grouping" className="block text-sm font-medium text-gray-700 mb-1">
        Group by:
      </label>
      <select
        id="grouping"
        value={value}
        onChange={(e) => onChange(e.target.value as GroupOption)}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="none">No Grouping</option>
        <option value="country">Country</option>
        <option value="company">Company</option>
        <option value="industry">Industry</option>
      </select>
    </div>
  );
}
