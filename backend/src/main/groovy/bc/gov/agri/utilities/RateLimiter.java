package bc.gov.agri.utilities;

import java.util.concurrent.Semaphore;

public class RateLimiter {
  private final Semaphore sem = new Semaphore(1);

  private final long delay;

  public RateLimiter(double perSecond) {
    delay = (long) ((1.0 / perSecond) * 1000);
  }

  public void acquire() {
    try {
      sem.acquire();

      new Thread(() -> {
        try {
          Thread.sleep(delay);
          sem.release();
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }).start();

    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

}
