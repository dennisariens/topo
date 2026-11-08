/* NINO macOS launcher (2.0.2).
   LaunchServices refuses an app whose CFBundleExecutable is a shell script (error -10669, reproduced with the public
   2.0.1 DMG). This small universal Mach-O is the bundle executable; it runs the unchanged install-and-open script
   Contents/Resources/launch.sh with /bin/sh and passes its arguments through (for example --install-only). */
#include <libgen.h>
#include <limits.h>
#include <mach-o/dyld.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  char raw[PATH_MAX], self[PATH_MAX], script[PATH_MAX];
  uint32_t size = sizeof raw;
  if (_NSGetExecutablePath(raw, &size) != 0 || realpath(raw, self) == NULL) return 70;
  if (snprintf(script, sizeof script, "%s/../Resources/launch.sh", dirname(self)) >= (int)sizeof script) return 70;
  char *child[argc + 3];
  child[0] = "sh";
  child[1] = script;
  for (int i = 1; i < argc; i++) child[i + 1] = argv[i];
  child[argc + 1] = NULL;
  execv("/bin/sh", child);
  perror("NINO: /bin/sh");
  return 71;
}
