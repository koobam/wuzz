import UIKit

final class PageCell: UICollectionViewCell, UITableViewDataSource {

  private let tableView = UITableView()

  override init(frame: CGRect) {
    super.init(frame: frame)

    contentView.backgroundColor = .white

    tableView.dataSource = self
    tableView.isScrollEnabled = false
    tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
    contentView.addSubview(tableView)
  }

  required init?(coder: NSCoder) {
    fatalError()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    tableView.frame = contentView.bounds
  }

  func configure(index: Int) {
    contentView.backgroundColor = index % 2 == 0
      ? UIColor.systemGray6
      : UIColor.systemGray4
  }

  func tableView(_ tableView: UITableView,
                 numberOfRowsInSection section: Int) -> Int {
    return 25
  }

  func tableView(_ tableView: UITableView,
                 cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
    cell.textLabel?.text = "Item \(indexPath.row)"
    return cell
  }
}
