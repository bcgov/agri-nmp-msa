package bc.gov.agri.representations

enum RiskRating implements Comparable<RiskRating> {
  LOW(1),
  MEDIUM(2),
  MEDIUM_HIGH(3),
  HIGH(4);

  final int value

  RiskRating(int value) {
    this.value = value
  }
}
