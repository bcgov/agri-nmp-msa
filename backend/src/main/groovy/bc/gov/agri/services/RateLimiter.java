package bc.gov.agri.services;

import java.util.concurrent.Semaphore;

public class RateLimiter {
  private final Semaphore sem = new Semaphore(1);

  public RateLimiter(double perSecond) {
    final long delay = (long) ((1.0 / perSecond) * 1000);
    new Thread(() -> {
      try {
        while (true) {
          Thread.sleep(delay);
          sem.release();
        }
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }).start();
  }

  public void acquire() {
    try {
      sem.acquire();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

}
