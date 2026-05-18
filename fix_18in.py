import re
with open(r'C:\Users\Mayn\.openclaw\workspace\ounin-clone\index.html', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('data-name="Steam Combi Oven (18', 'data-name="Steam Combi Oven (18in)')
with open(r'C:\Users\Mayn\.openclaw\workspace\ounin-clone\index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('done')